"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadSticker(
    username: string,
    formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
    try {
        const session = await auth();
        const sessionUsername = (session?.user as { username?: string } | undefined)?.username;

        if (!sessionUsername || sessionUsername !== username) {
            return { ok: false, error: "Not authorized." };
        }

        const file = formData.get("sticker");
        if (!(file instanceof File) || file.size === 0) {
            return { ok: false, error: "No file uploaded." };
        }
        const ext = ALLOWED_TYPES[file.type];
        if (!ext) {
            return { ok: false, error: "File must be JPG, PNG, GIF, or WEBP." };
        }
        if (file.size > MAX_SIZE) {
            return { ok: false, error: "File must be under 5 MB." };
        }

        const filename = `${username}-sticker-${Date.now()}.${ext}`;
        const filepath = path.join(process.cwd(), "public", "uploads", filename);

        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(arrayBuffer));

        return { ok: true, url: `/uploads/${filename}` };
    } catch (err) {
        console.error("uploadSticker threw:", err);
        return { ok: false, error: err instanceof Error ? err.message : "Server error." };
    }
}
