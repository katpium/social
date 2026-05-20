"use server";

import { auth } from "@/auth";
import { getPosts, writePosts, type Post, type Comment } from "@/app/data/blog";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const TITLE_MAX = 200;
const BODY_MAX = 20000;
const COMMENT_MAX = 2000;

async function getSessionUsername(): Promise<string | null> {
    const session = await auth();
    return (session?.user as { username?: string } | undefined)?.username ?? null;
}

function newId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPost(formData: FormData): Promise<void> {
    const me = await getSessionUsername();
    if (!me) redirect("/login");

    const title = String(formData.get("title") ?? "").trim().slice(0, TITLE_MAX);
    const body = String(formData.get("body") ?? "").trim().slice(0, BODY_MAX);

    if (!title || !body) {
        redirect(`/users/${me}/blog/new?error=empty`);
    }

    const posts = getPosts();
    const post: Post = {
        id: newId("p"),
        authorUsername: me,
        title,
        body,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
    };
    posts.unshift(post);
    writePosts(posts);

    revalidatePath(`/users/${me}/blog`);
    revalidatePath(`/users/${me}`);
    redirect(`/users/${me}/blog/${post.id}`);
}

export async function togglePostLike(postId: string): Promise<void> {
    try {
        const me = await getSessionUsername();
        if (!me) return;

        const posts = getPosts();
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const i = post.likes.indexOf(me);
        if (i >= 0) post.likes.splice(i, 1);
        else post.likes.push(me);

        writePosts(posts);
        revalidatePath(`/users/${post.authorUsername}/blog`);
        revalidatePath(`/users/${post.authorUsername}/blog/${postId}`);
    } catch (err) {
        console.error("togglePostLike threw:", err);
    }
}

export async function addComment(postId: string, formData: FormData): Promise<void> {
    try {
        const me = await getSessionUsername();
        if (!me) return;

        const body = String(formData.get("body") ?? "").trim().slice(0, COMMENT_MAX);
        if (!body) return;

        const posts = getPosts();
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const comment: Comment = {
            id: newId("c"),
            authorUsername: me,
            body,
            createdAt: new Date().toISOString(),
        };
        post.comments.push(comment);

        writePosts(posts);
        revalidatePath(`/users/${post.authorUsername}/blog/${postId}`);
    } catch (err) {
        console.error("addComment threw:", err);
    }
}
