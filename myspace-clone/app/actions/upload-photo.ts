"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { getUsers, writeUsers } from "@/app/data/users";
import { revalidatePath } from "next/cache";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadPhoto(
    username: string,
    formData: FormData
): Promise<{ ok: boolean; error?: string }> {
    const session = await auth();
    const sessionUsername = (session?.user as { username?: string } | undefined)?.username;

    if (!sessionUsername || sessionUsername !== username) {
        return { ok: false, error: "Not authorized." };
    }

    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) {
        return { ok: false, error: "No file uploaded." };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { ok: false, error: "File must be a JPG, PNG, GIF, or WEBP image." };
    }
    if (file.size > MAX_SIZE) {
        return { ok: false, error: "File must be under 5 MB." };
    }

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${username}-${Date.now()}.${ext}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(arrayBuffer));

    const users = getUsers();
    const user = users.find((u) => u.username === username);
    if (!user) return { ok: false, error: "User not found." };
    user.photoUrl = `/uploads/${filename}`;
    writeUsers(users);

    revalidatePath(`/users/${username}`);
    return { ok: true };
}
