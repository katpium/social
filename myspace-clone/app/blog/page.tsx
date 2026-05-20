import Link from "next/link";
import Header from "../components/header";
import NavBar from "../components/NavBar";
import { getPosts } from "../data/blog";
import { getUserByUsername } from "../data/users";

export default function GlobalBlogPage() {
    const posts = getPosts()
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <h2 className="box-title">All Blog Entries</h2>

                    {posts.length === 0 ? (
                        <p className="blog-empty mail-empty">
                            <em>No blog posts yet. Be the first!</em>
                        </p>
                    ) : (
                        <ul className="blog-post-list">
                            {posts.map((post) => {
                                const author = getUserByUsername(post.authorUsername);
                                const authorName = author?.name ?? post.authorUsername;
                                return (
                                    <li key={post.id} className="blog-post-summary">
                                        <h3>
                                            <Link
                                                href={`/users/${post.authorUsername}/blog/${post.id}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="blog-post-meta">
                                            by{" "}
                                            <Link href={`/users/${post.authorUsername}`}>
                                                {authorName}
                                            </Link>
                                            {" · "}
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
                                );
                            })}
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
