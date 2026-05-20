import "server-only";
import fs from "fs";
import path from "path";

export type Comment = {
    id: string;
    authorUsername: string;
    body: string;
    createdAt: string;
};

export type Post = {
    id: string;
    authorUsername: string;
    title: string;
    body: string;
    createdAt: string;
    likes: string[];
    comments: Comment[];
};

const BLOG_PATH = path.join(process.cwd(), "app/data/blog.json");

export function getPosts(): Post[] {
    if (!fs.existsSync(BLOG_PATH)) return [];
    return JSON.parse(fs.readFileSync(BLOG_PATH, "utf-8"));
}

export function writePosts(posts: Post[]): void {
    fs.writeFileSync(BLOG_PATH, JSON.stringify(posts, null, 2));
}

export function getPostsByAuthor(username: string): Post[] {
    return getPosts()
        .filter((p) => p.authorUsername === username)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPostById(id: string): Post | undefined {
    return getPosts().find((p) => p.id === id);
}
