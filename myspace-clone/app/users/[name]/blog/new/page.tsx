import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "../../../../components/header";
import NavBar from "../../../../components/NavBar";
import { createPost } from "../../../../actions/blog";
import { getUserByUsername } from "../../../../data/users";

type Props = {
    params: Promise<{ name: string }>;
    searchParams: Promise<{ error?: string }>;
};

export default async function NewBlogPostPage({ params, searchParams }: Props) {
    const { name } = await params;
    const { error } = await searchParams;
    const user = getUserByUsername(name);

    if (!user) {
        return <h1>User does not exist.</h1>;
    }

    const session = await auth();
    const me = (session?.user as { username?: string } | undefined)?.username ?? null;
    if (me !== user.username) {
        redirect(`/users/${user.username}/blog`);
    }

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <h2 className="blog-title">
                        New Blog Post{" "}
                        <Link href={`/users/${user.username}/blog`}>[Cancel]</Link>
                    </h2>

                    {error === "empty" && (
                        <p className="blog-form-error">
                            Title and body are both required.
                        </p>
                    )}

                    <form action={createPost} className="blog-form">
                        <label>
                            Title
                            <input
                                type="text"
                                name="title"
                                required
                                maxLength={200}
                            />
                        </label>
                        <label>
                            Body
                            <textarea
                                name="body"
                                required
                                maxLength={20000}
                                rows={12}
                            />
                        </label>
                        <div className="blog-form-actions">
                            <button type="submit" className="save-button">
                                Publish
                            </button>
                            <Link
                                href={`/users/${user.username}/blog`}
                                className="cancel-button"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
