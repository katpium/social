import Link from "next/link";
import { getPostsByAuthor } from "../data/blog";

type BlogEntryProps = {
    username: string;
    name: string;
};

export default function BlogEntry({ username, name }: BlogEntryProps) {
    const posts = getPostsByAuthor(username).slice(0, 3);

    return (
        <div className="blog-section">
            <h2 className="blog-title">
                {name}&apos;s Latest Blog Entries{" "}
                <Link href={`/users/${username}/blog`}>[View Blog]</Link>
            </h2>
            {posts.length === 0 ? (
                <p className="blog-empty">
                    <em>There are no Blog Entries yet.</em>
                </p>
            ) : (
                <ul className="blog-preview-list">
                    {posts.map((post) => (
                        <li key={post.id} className="blog-preview">
                            <Link
                                href={`/users/${username}/blog/${post.id}`}
                                className="blog-preview-title"
                            >
                                {post.title}
                            </Link>
                            <span className="blog-preview-meta">
                                {" — "}
                                {formatDate(post.createdAt)}
                                {" · "}
                                {post.likes.length} ♥
                                {" · "}
                                {post.comments.length} 💬
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
