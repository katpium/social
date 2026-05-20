import Link from "next/link";
import Header from "./components/header";
import NavBar from "./components/NavBar";
import { getUsers } from "./data/users";

export default function Home() {
  const users = getUsers();
  return (
    <main>
      <Header />
      <NavBar />

      <div className="container">
        <section className="section-right">
          <h2>Browse Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.username}>
                <Link href={`/users/${user.username}`}>
                  {user.name}
                </Link>
                {" — "}
                {user.status}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
