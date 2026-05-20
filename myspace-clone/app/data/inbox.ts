import "server-only";
import fs from "fs";
import path from "path";

export type FriendRequest = {
    id: string;
    type: "friend_request";
    from: string;
    to: string;
    status: "pending" | "approved" | "denied";
    createdAt: string;
};

export type Message = {
    id: string;
    type: "message";
    from: string;
    to: string;
    body: string;
    read: boolean;
    createdAt: string;
};

export type InboxItem = FriendRequest | Message;

const INBOX_PATH = path.join(process.cwd(), "app/data/inbox.json");

export function getInbox(): InboxItem[] {
    if (!fs.existsSync(INBOX_PATH)) return [];
    return JSON.parse(fs.readFileSync(INBOX_PATH, "utf-8"));
}

export function writeInbox(items: InboxItem[]): void {
    fs.writeFileSync(INBOX_PATH, JSON.stringify(items, null, 2));
}

export function hasPendingRequest(from: string, to: string): boolean {
    return getInbox().some(
        (i) =>
            i.type === "friend_request" &&
            i.from === from &&
            i.to === to &&
            i.status === "pending"
    );
}
