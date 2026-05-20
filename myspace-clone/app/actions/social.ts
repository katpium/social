"use server";

import { auth } from "@/auth";
import { getUsers, writeUsers, type User } from "@/app/data/users";
import { revalidatePath } from "next/cache";

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

export async function toggleFriend(targetUsername: string): Promise<void> {
    try {
        const me = await getSessionUsername();
        if (!me || me === targetUsername) return;

        const users = getUsers();
        const meUser = users.find((u) => u.username === me);
        const otherUser = users.find((u) => u.username === targetUsername);
        if (!meUser || !otherUser) return;

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
    } catch (err) {
        console.error("toggleFriend threw:", err);
    }
}

export async function toggleFavorite(targetUsername: string): Promise<void> {
    try {
        const me = await getSessionUsername();
        if (!me || me === targetUsername) return;

        const users = getUsers();
        const meUser = users.find((u) => u.username === me);
        if (!meUser) return;

        meUser.favorites = toggleInArray(meUser.favorites, targetUsername);

        writeUsers(users);
        revalidatePath(`/users/${targetUsername}`);
    } catch (err) {
        console.error("toggleFavorite threw:", err);
    }
}

export async function toggleBlock(targetUsername: string): Promise<void> {
    try {
        const me = await getSessionUsername();
        if (!me || me === targetUsername) return;

        const users = getUsers();
        const meUser = users.find((u) => u.username === me);
        if (!meUser) return;

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
    } catch (err) {
        console.error("toggleBlock threw:", err);
    }
}
