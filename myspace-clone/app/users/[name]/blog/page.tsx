import Link from "next/link";
import { auth } from "@/auth";
import Header from "../../../components/header";
import NavBar from "../../../components/NavBar";
import { getUserByUsername } from "../../../data/users";
import { getPostsByAuthor } from "../../../data/blog";

type Props = {
    params: Promise<{ name: string }>;
};

export default async function UserBlogPage({ params }: Props) {
    const { name } = await params;
    const user = getUserByUsername(name);

    if (!user) {
        return <h1>User does not exist.</h1>;
    }

    const session = await auth();
    const me = (session?.user as { username?: string } | undefined)?.username ?? null;
    const isOwner = me === user.username;

    const posts = getPostsByAuthor(user.username);

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <h2 className="blog-title">
                        {user.name}&apos;s Blog{" "}
                        <Link href={`/users/${user.username}`}>[Back to Profile]</Link>
                    </h2>

                    {isOwner && (
                        <p>
                            <Link
                                href={`/users/${user.username}/blog/new`}
                                className="blog-new-link"
                            >
                                ✎ Write a new blog post
                            </Link>
                        </p>
                    )}

                    {posts.length === 0 ? (
                        <p className="blog-empty">
                            <em>There are no Blog Entries yet.</em>
                        </p>
                    ) : (
                        <ul className="blog-post-list">
                            {posts.map((post) => (
                                <li key={post.id} className="blog-post-summary">
                                    <h3>
                                        <Link
                                            href={`/users/${user.username}/blog/${post.id}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="blog-post-meta">
                                        {formatDate(post.createdAt)}
                                        {" · "}
                                        {post.likes.length} like
                                        {post.likes.length === 1 ? "" : "s"}
                                        {" · "}
                                        {post.comments.length} comment
                                        {post.comments.length === 1 ? "" : "s"}
                                    </p>
                                    <p className="blog-post-snippet">
                                        {snippet(post.body)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function snippet(body: string): string {
    const oneLine = body.replace(/\s+/g, " ").trim();
    return oneLine.length > 200 ? oneLine.slice(0, 200) + "…" : oneLine;
}
