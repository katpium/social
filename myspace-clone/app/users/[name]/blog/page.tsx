import Link from "next/link";
import Header from "../../../components/header";
import NavBar from "../../../components/NavBar";
import { getUserByUsername } from "../../../data/users";

type Props = {
    params: Promise<{ name: string }>;
};

export default async function UserBlogPage({ params }: Props) {
    const { name } = await params;
    const user = getUserByUsername(name);

    if (!user) {
        return <h1>User does not exist.</h1>;
    }

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
                    <p className="blog-empty">
                        <em>There are no Blog Entries yet.</em>
                    </p>
                </section>
            </div>
        </main>
    );
}
