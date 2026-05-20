"use server";

import { auth } from "@/auth";
import { getUsers, writeUsers, type User } from "@/app/data/users";
import { revalidatePath } from "next/cache";

type Result = { ok: boolean; error?: string };

async function getSessionUsername(): Promise<string | null> {
    const session = await auth();
    return (session?.user as { username?: string } | undefined)?.username ?? null;
}

function toggleInArray(arr: string[] | undefined, value: string): string[] {
    const next = arr ? [...arr] : [];
    const i = next.indexOf(value);
    if (i >= 0) next.splice(i, 1);
    else next.push(value);
    return next;
}

export async function toggleFriend(targetUsername: string): Promise<Result> {
    const me = await getSessionUsername();
    if (!me) return { ok: false, error: "Not logged in." };
    if (me === targetUsername) return { ok: false, error: "Can't friend yourself." };

    const users = getUsers();
    const meUser = users.find((u) => u.username === me);
    const otherUser = users.find((u) => u.username === targetUsername);
    if (!meUser || !otherUser) return { ok: false, error: "User not found." };

    const wasFriend = meUser.friends.includes(targetUsername);
    meUser.friends = toggleInArray(meUser.friends, targetUsername);
    if (wasFriend) {
        otherUser.friends = otherUser.friends.filter((u) => u !== me);
    } else if (!otherUser.friends.includes(me)) {
        otherUser.friends = [...otherUser.friends, me];
    }

    writeUsers(users);
    revalidatePath(`/users/${targetUsername}`);
    revalidatePath(`/users/${me}`);
    return { ok: true };
}

export async function toggleFavorite(targetUsername: string): Promise<Result> {
    const me = await getSessionUsername();
    if (!me) return { ok: false, error: "Not logged in." };
    if (me === targetUsername) return { ok: false, error: "Can't favorite yourself." };

    const users = getUsers();
    const meUser = users.find((u) => u.username === me);
    if (!meUser) return { ok: false, error: "User not found." };

    meUser.favorites = toggleInArray(meUser.favorites, targetUsername);

    writeUsers(users);
    revalidatePath(`/users/${targetUsername}`);
    return { ok: true };
}

export async function toggleBlock(targetUsername: string): Promise<Result> {
    const me = await getSessionUsername();
    if (!me) return { ok: false, error: "Not logged in." };
    if (me === targetUsername) return { ok: false, error: "Can't block yourself." };

    const users = getUsers();
    const meUser = users.find((u) => u.username === me);
    if (!meUser) return { ok: false, error: "User not found." };

    const wasBlocked = meUser.blocked?.includes(targetUsername) ?? false;
    meUser.blocked = toggleInArray(meUser.blocked, targetUsername);

    if (!wasBlocked) {
        meUser.friends = meUser.friends.filter((u) => u !== targetUsername);
        const other = users.find((u: User) => u.username === targetUsername);
        if (other) other.friends = other.friends.filter((u) => u !== me);
    }

    writeUsers(users);
    revalidatePath(`/users/${targetUsername}`);
    revalidatePath(`/users/${me}`);
    return { ok: true };
}
