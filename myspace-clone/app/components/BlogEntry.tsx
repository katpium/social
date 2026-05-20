import Link from "next/link";

type BlogEntryProps = {
    username: string;
    name: string;
};

export default function BlogEntry({ username, name }: BlogEntryProps) {
    return (
        <div className="blog-section">
            <h2 className="blog-title">
                {name}&apos;s Latest Blog Entries{" "}
                <Link href={`/users/${username}/blog`}>[View Blog]</Link>
            </h2>
            <p className="blog-empty"><em>There are no Blog Entries yet.</em></p>
        </div>
    );
}
