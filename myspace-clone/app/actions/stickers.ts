"use server";

import { auth } from "@/auth";
import { getUsers, writeUsers } from "@/app/data/users";
import type { StickerPlacement } from "@/app/data/sticker";
import { revalidatePath } from "next/cache";

const EMOJI_MAX_LEN = 8;
const ID_MAX_LEN = 48;
const MIN_SIZE = 16;
const MAX_SIZE = 240;
const COORD_MIN = -500;
const COORD_MAX = 3000;
const MAX_STICKERS = 50;

export async function setUserStickers(
    username: string,
    stickers: StickerPlacement[]
): Promise<{ ok: boolean; error?: string }> {
    try {
        const session = await auth();
        const me = (session?.user as { username?: string } | undefined)?.username;
        if (!me || me !== username) {
            return { ok: false, error: "Not authorized." };
        }

        if (!Array.isArray(stickers)) {
            return { ok: false, error: "Invalid stickers payload." };
        }

        const users = getUsers();
        const user = users.find((u) => u.username === username);
        if (!user) return { ok: false, error: "User not found." };

        user.stickers = stickers
            .filter(
                (s) =>
                    s &&
                    typeof s.id === "string" &&
                    s.id.length > 0 &&
                    s.id.length <= ID_MAX_LEN &&
                    typeof s.emoji === "string" &&
                    s.emoji.length > 0 &&
                    s.emoji.length <= EMOJI_MAX_LEN &&
                    Number.isFinite(s.x) &&
                    Number.isFinite(s.y) &&
                    Number.isFinite(s.size)
            )
            .slice(0, MAX_STICKERS)
            .map((s) => {
                const base: StickerPlacement = {
                    id: s.id,
                    emoji: s.emoji,
                    x: clamp(Math.round(s.x), COORD_MIN, COORD_MAX),
                    y: clamp(Math.round(s.y), COORD_MIN, COORD_MAX),
                    size: clamp(Math.round(s.size), MIN_SIZE, MAX_SIZE),
                };
                if (typeof s.rotation === "number" && Number.isFinite(s.rotation)) {
                    base.rotation = ((Math.round(s.rotation) % 360) + 360) % 360;
                }
                if (typeof s.opacity === "number" && Number.isFinite(s.opacity)) {
                    base.opacity = clamp(s.opacity, 0, 1);
                }
                if (s.wiggle === true) {
                    base.wiggle = true;
                }
                return base;
            });

        writeUsers(users);
        revalidatePath(`/users/${username}`);
        return { ok: true };
    } catch (err) {
        console.error("setUserStickers threw:", err);
        return { ok: false, error: err instanceof Error ? err.message : "Server error." };
    }
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}
