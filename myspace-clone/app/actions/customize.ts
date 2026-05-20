"use server";

import { auth } from "@/auth";
import { getUsers, writeUsers, type User } from "@/app/data/users";
import { revalidatePath } from "next/cache";

const ALLOWED_PATTERNS = new Set(["none", "stars", "hearts", "checker", "stripes"]);
const HEX = /^#[0-9a-fA-F]{6}$/;

type CustomizationPatch = {
    theme?: {
        bgColor?: string;
        bgPattern?: string;
        accentColor?: string;
        accentShadeColor?: string;
        accentTextColor?: string;
        cardColor?: string;
        textColor?: string;
    };
    music?: { url: string; title: string } | null;
};

export async function updateUserCustomization(
    username: string,
    patch: CustomizationPatch
): Promise<{ ok: boolean; error?: string }> {
    try {
        const session = await auth();
        const me = (session?.user as { username?: string } | undefined)?.username;
        if (!me || me !== username) {
            return { ok: false, error: "Not authorized." };
        }

        const users = getUsers();
        const user = users.find((u) => u.username === username);
        if (!user) return { ok: false, error: "User not found." };

        if (patch.theme) {
            const t: NonNullable<User["theme"]> = user.theme ?? {};
            if (typeof patch.theme.bgColor === "string" && HEX.test(patch.theme.bgColor)) {
                t.bgColor = patch.theme.bgColor;
            }
            if (typeof patch.theme.accentColor === "string" && HEX.test(patch.theme.accentColor)) {
                t.accentColor = patch.theme.accentColor;
            }
            if (
                typeof patch.theme.accentShadeColor === "string" &&
                HEX.test(patch.theme.accentShadeColor)
            ) {
                t.accentShadeColor = patch.theme.accentShadeColor;
            }
            if (
                typeof patch.theme.accentTextColor === "string" &&
                HEX.test(patch.theme.accentTextColor)
            ) {
                t.accentTextColor = patch.theme.accentTextColor;
            }
            if (typeof patch.theme.cardColor === "string" && HEX.test(patch.theme.cardColor)) {
                t.cardColor = patch.theme.cardColor;
            }
            if (typeof patch.theme.textColor === "string" && HEX.test(patch.theme.textColor)) {
                t.textColor = patch.theme.textColor;
            }
            if (
                typeof patch.theme.bgPattern === "string" &&
                ALLOWED_PATTERNS.has(patch.theme.bgPattern)
            ) {
                t.bgPattern = patch.theme.bgPattern;
            }
            user.theme = t;
        }

        if (patch.music === null) {
            user.music = undefined;
        } else if (
            patch.music &&
            typeof patch.music.url === "string" &&
            (/^https?:\/\//i.test(patch.music.url) || /^\/uploads\//.test(patch.music.url))
        ) {
            user.music = {
                url: patch.music.url.slice(0, 500),
                title:
                    typeof patch.music.title === "string"
                        ? patch.music.title.slice(0, 120)
                        : "",
            };
        }

        writeUsers(users);
        revalidatePath(`/users/${username}`);
        return { ok: true };
    } catch (err) {
        console.error("updateUserCustomization threw:", err);
        return { ok: false, error: err instanceof Error ? err.message : "Server error." };
    }
}
