import Link from "next/link";
import { auth } from "@/auth";
import Header from "./components/header";
import NavBar from "./components/NavBar";
import { getUsers } from "./data/users";
import { loginAction } from "./login/actions";

export default async function Home() {
  const session = await auth();
  const me = (session?.user as { username?: string } | undefined)?.username ?? null;
  const users = getUsers();

  return (
    <main>
      <Header />
      <NavBar />

      <div className="container">
        {!me && (
          <aside className="section-left">
            <div className="about-box">
              <h2 className="box-title">Member Login</h2>
              <form action={loginAction} className="login-form">
                <label>
                  Username:
                  <input name="username" type="text" required />
                </label>
                <label>
                  Password:
                  <input name="password" type="password" required />
                </label>
                <button type="submit" className="login-button">
                  Log In
                </button>
              </form>
              <p className="home-login-hint">
                Try: <strong>john</strong> / <strong>hiking123</strong>
              </p>
              <p className="home-login-hint">
                New here?{" "}
                <Link href="/signup" className="home-signup-link">
                  Create an account
                </Link>
                .
              </p>
            </div>
          </aside>
        )}

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
