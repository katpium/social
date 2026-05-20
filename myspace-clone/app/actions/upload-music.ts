"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const ALLOWED_TYPES: Record<string, string> = {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/wave": "wav",
};
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function uploadMusic(
    username: string,
    formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
    try {
        const session = await auth();
        const sessionUsername = (session?.user as { username?: string } | undefined)?.username;

        if (!sessionUsername || sessionUsername !== username) {
            return { ok: false, error: "Not authorized." };
        }

        const file = formData.get("music");
        if (!(file instanceof File) || file.size === 0) {
            return { ok: false, error: "No file uploaded." };
        }
        const ext = ALLOWED_TYPES[file.type];
        if (!ext) {
            return { ok: false, error: "File must be an MP3, OGG, or WAV." };
        }
        if (file.size > MAX_SIZE) {
            return { ok: false, error: "File must be under 20 MB." };
        }

        const filename = `${username}-music-${Date.now()}.${ext}`;
        const filepath = path.join(process.cwd(), "public", "uploads", filename);

        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(arrayBuffer));

        return { ok: true, url: `/uploads/${filename}` };
    } catch (err) {
        console.error("uploadMusic threw:", err);
        return { ok: false, error: err instanceof Error ? err.message : "Server error." };
    }
}
