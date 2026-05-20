import "server-only";
import fs from "fs";
import path from "path";
import type { StickerPlacement } from "./sticker";

export type User = {
    username: string;
    password: string;
    name: string;
    status: string;
    bio: string;
    mood: string;
    about: string;
    answer: string;
    photoUrl?: string;
    interests: {
        general: string;
        music: string;
        movies: string;
        television: string;
        books: string;
        heroes: string;
    };
    friends: string[];
    favorites?: string[];
    blocked?: string[];
    theme?: {
        bgColor?: string;
        bgPattern?: string;
        accentColor?: string;
        cardColor?: string;
        textColor?: string;
    };
    music?: {
        url: string;
        title: string;
    };
    stickers?: StickerPlacement[];
};

const USERS_PATH = path.join(process.cwd(), "app/data/users.json");

export function getUsers(): User[] {
    const raw = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8")) as Array<Record<string, unknown>>;
    return raw.map(normalizeUser) as unknown as User[];
}

export function getUserByUsername(username: string): User | undefined {
    return getUsers().find((u) => u.username === username);
}

export function writeUsers(users: User[]): void {
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

function normalizeUser(u: Record<string, unknown>): Record<string, unknown> {
    const stickers = u.stickers;
    if (Array.isArray(stickers) && stickers.length > 0 && typeof stickers[0] === "string") {
        u.stickers = (stickers as string[]).map((emoji, i) => ({
            id: `legacy-${i}-${emoji.codePointAt(0) ?? i}`,
            emoji,
            x: 80 + (i % 5) * 50,
            y: 60 + Math.floor(i / 5) * 50,
            size: 40,
        }));
    }
    return u;
}
