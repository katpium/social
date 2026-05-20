import Link from "next/link";
import { auth } from "@/auth";
import Header from "../../../../components/header";
import NavBar from "../../../../components/NavBar";
import { getUserByUsername } from "../../../../data/users";
import { getPostById } from "../../../../data/blog";
import { togglePostLike, addComment } from "../../../../actions/blog";

type Props = {
    params: Promise<{ name: string; postId: string }>;
};

export default async function BlogPostPage({ params }: Props) {
    const { name, postId } = await params;
    const user = getUserByUsername(name);
    const post = getPostById(postId);

    if (!user || !post || post.authorUsername !== user.username) {
        return (
            <main>
                <Header />
                <NavBar />
                <div className="container">
                    <section className="section-right">
                        <h2 className="blog-title">Post not found.</h2>
                        <p>
                            <Link href={`/users/${name}/blog`}>← Back to blog</Link>
                        </p>
                    </section>
                </div>
            </main>
        );
    }

    const session = await auth();
    const me = (session?.user as { username?: string } | undefined)?.username ?? null;
    const isLoggedIn = !!me;
    const hasLiked = me ? post.likes.includes(me) : false;

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <h2 className="blog-title">
                        {post.title}{" "}
                        <Link href={`/users/${user.username}/blog`}>[Back to Blog]</Link>
                    </h2>

                    <p className="blog-post-meta">
                        by{" "}
                        <Link href={`/users/${user.username}`}>{user.name}</Link>
                        {" · "}
                        {formatDate(post.createdAt)}
                    </p>

                    <div className="blog-post-body">{post.body}</div>

                    <div className="blog-post-actions">
                        {isLoggedIn ? (
                            <form action={togglePostLike.bind(null, post.id)}>
                                <button
                                    type="submit"
                                    className={
                                        "blog-like-button" +
                                        (hasLiked ? " liked" : "")
                                    }
                                >
                                    {hasLiked ? "♥" : "♡"} {post.likes.length}{" "}
                                    {post.likes.length === 1 ? "Like" : "Likes"}
                                </button>
                            </form>
                        ) : (
                            <p className="blog-post-meta">
                                <Link href="/login">Log in</Link> to like or comment.
                            </p>
                        )}
                    </div>

                    <h3 className="section-title blog-comments-title">
                        Comments ({post.comments.length})
                    </h3>

                    {post.comments.length === 0 ? (
                        <p className="blog-empty">
                            <em>No comments yet. Be the first!</em>
                        </p>
                    ) : (
                        <ul className="blog-comment-list">
                            {post.comments.map((c) => (
                                <li key={c.id} className="blog-comment">
                                    <p className="blog-comment-meta">
                                        <Link href={`/users/${c.authorUsername}`}>
                                            {c.authorUsername}
                                        </Link>
                                        {" · "}
                                        {formatDate(c.createdAt)}
                                    </p>
                                    <p className="blog-comment-body">{c.body}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {isLoggedIn && (
                        <form
                            action={addComment.bind(null, post.id)}
                            className="blog-comment-form"
                        >
                            <textarea
                                name="body"
                                placeholder="Write a comment..."
                                required
                                maxLength={2000}
                                rows={3}
                            />
                            <button type="submit" className="save-button">
                                Post Comment
                            </button>
                        </form>
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
