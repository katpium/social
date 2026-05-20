"use server";

import { auth } from "@/auth";
import { getUsers, writeUsers } from "@/app/data/users";
import { revalidatePath } from "next/cache";

export async function updateUserField(
    username: string,
    field: string,
    value: string
): Promise<{ ok: boolean; error?: string }> {
    const session = await auth();
    const sessionUsername = (session?.user as { username?: string } | undefined)?.username;

    if (!sessionUsername || sessionUsername !== username) {
        return { ok: false, error: "Not authorized." };
    }

    if (field === "username" || field === "password" || field === "friends") {
        return { ok: false, error: "This field cannot be edited here." };
    }

    const users = getUsers();
    const user = users.find((u) => u.username === username);
    if (!user) return { ok: false, error: "User not found." };

    const parts = field.split(".");
    let target: Record<string, unknown> = user as unknown as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
        const next = target[parts[i]];
        if (typeof next !== "object" || next === null) {
            return { ok: false, error: `Invalid field path: ${field}` };
        }
        target = next as Record<string, unknown>;
    }
    target[parts[parts.length - 1]] = value;

    writeUsers(users);
    revalidatePath(`/users/${username}`);
    return { ok: true };
}
