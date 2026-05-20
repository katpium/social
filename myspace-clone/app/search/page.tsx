import Link from "next/link";
import Header from "../components/header";
import NavBar from "../components/NavBar";
import { getUsers } from "../data/users";

type Props = {
    searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const { q = "" } = await searchParams;
    const query = q.trim();

    const results = query
        ? getUsers().filter((u) => {
              const needle = query.toLowerCase();
              return (
                  u.username.toLowerCase().includes(needle) ||
                  u.name.toLowerCase().includes(needle)
              );
          })
        : [];

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <h2>Search Results</h2>

                    {query ? (
                        <p>
                            Showing matches for <strong>{query}</strong> —{" "}
                            {results.length} {results.length === 1 ? "user" : "users"} found.
                        </p>
                    ) : (
                        <p><em>Enter a name or username in the search bar above.</em></p>
                    )}

                    {results.length > 0 && (
                        <ul>
                            {results.map((user) => (
                                <li key={user.username}>
                                    <Link href={`/users/${user.username}`}>{user.name}</Link>
                                    {" — "}
                                    {user.status}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
