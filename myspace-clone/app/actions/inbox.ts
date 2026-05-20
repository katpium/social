"use server";

import { auth } from "@/auth";
import {
    getInbox,
    writeInbox,
    type FriendRequest,
    type Message,
} from "@/app/data/inbox";
import { getUsers, writeUsers } from "@/app/data/users";
import { revalidatePath } from "next/cache";

async function getSessionUsername(): Promise<string | null> {
    const session = await auth();
    return (session?.user as { username?: string } | undefined)?.username ?? null;
}

function newId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function sendFriendRequest(targetUsername: string): Promise<void> {
    try {
        const sender = await getSessionUsername();
        if (!sender || sender === targetUsername) return;

        const users = getUsers();
        const senderUser = users.find((u) => u.username === sender);
        const targetUser = users.find((u) => u.username === targetUsername);
        if (!senderUser || !targetUser) return;
        if (senderUser.friends.includes(targetUsername)) return;

        const items = getInbox();
        const existing = items.find(
            (i) =>
                i.type === "friend_request" &&
                i.from === sender &&
                i.to === targetUsername &&
                i.status === "pending"
        );
        if (existing) return;

        const request: FriendRequest = {
            id: newId("fr"),
            type: "friend_request",
            from: sender,
            to: targetUsername,
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        items.push(request);
        writeInbox(items);

        revalidatePath(`/users/${targetUsername}`);
        revalidatePath(`/users/${sender}`);
        revalidatePath(`/mail`);
    } catch (err) {
        console.error("sendFriendRequest threw:", err);
    }
}

export async function approveFriendRequest(requestId: string): Promise<void> {
    try {
        const recipient = await getSessionUsername();
        if (!recipient) return;

        const items = getInbox();
        const req = items.find(
            (i): i is FriendRequest =>
                i.type === "friend_request" && i.id === requestId
        );
        if (!req || req.to !== recipient || req.status !== "pending") return;

        req.status = "approved";

        const users = getUsers();
        const a = users.find((u) => u.username === req.from);
        const b = users.find((u) => u.username === req.to);
        if (a && b) {
            if (!a.friends.includes(b.username)) a.friends.push(b.username);
            if (!b.friends.includes(a.username)) b.friends.push(a.username);
            writeUsers(users);
        }

        writeInbox(items);
        revalidatePath(`/mail`);
        revalidatePath(`/users/${req.from}`);
        revalidatePath(`/users/${req.to}`);
    } catch (err) {
        console.error("approveFriendRequest threw:", err);
    }
}

export async function denyFriendRequest(requestId: string): Promise<void> {
    try {
        const recipient = await getSessionUsername();
        if (!recipient) return;

        const items = getInbox();
        const req = items.find(
            (i): i is FriendRequest =>
                i.type === "friend_request" && i.id === requestId
        );
        if (!req || req.to !== recipient || req.status !== "pending") return;

        req.status = "denied";
        writeInbox(items);
        revalidatePath(`/mail`);
    } catch (err) {
        console.error("denyFriendRequest threw:", err);
    }
}

export async function getConversation(
    targetUsername: string
): Promise<Message[]> {
    try {
        const me = await getSessionUsername();
        if (!me) return [];
        return getInbox()
            .filter(
                (i): i is Message =>
                    i.type === "message" &&
                    ((i.from === me && i.to === targetUsername) ||
                        (i.from === targetUsername && i.to === me))
            )
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } catch (err) {
        console.error("getConversation threw:", err);
        return [];
    }
}

export async function sendMessage(
    targetUsername: string,
    formData: FormData
): Promise<void> {
    try {
        const sender = await getSessionUsername();
        if (!sender || sender === targetUsername) return;

        const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
        if (!body) return;

        const users = getUsers();
        if (!users.find((u) => u.username === targetUsername)) return;

        const items = getInbox();
        const message: Message = {
            id: newId("m"),
            type: "message",
            from: sender,
            to: targetUsername,
            body,
            read: false,
            createdAt: new Date().toISOString(),
        };
        items.push(message);
        writeInbox(items);

        revalidatePath(`/mail`);
    } catch (err) {
        console.error("sendMessage threw:", err);
    }
}
