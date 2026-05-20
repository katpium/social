import Link from "next/link";
import Header from "../components/header";
import NavBar from "../components/NavBar";
import WelcomeSidebar from "../components/WelcomeSidebar";
import { loginAction } from "./actions";

export default function LoginPage() {
    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <aside className="section-left">
                    <WelcomeSidebar
                        title="✨ Welcome Back ✨"
                        subtitle="a space for friends"
                        bullets={[
                            "🌟 Customize your profile with stickers, music & themes",
                            "💖 Add friends, send messages, write blog posts",
                            "🦄 Be your most authentic 2006 self",
                        ]}
                    />
                </aside>

                <section className="section-right">
                    <div className="auth-card">
                        <h2 className="auth-card-title">★ Member Login ★</h2>

                        <form action={loginAction} className="auth-form">
                            <label>
                                Username
                                <input name="username" type="text" required />
                            </label>

                            <label>
                                Password
                                <input
                                    name="password"
                                    type="password"
                                    required
                                />
                            </label>

                            <button type="submit" className="auth-submit">
                                Log In
                            </button>
                        </form>

                        <hr className="auth-divider" />

                        <p className="auth-hint">
                            Try: <strong>john</strong> / <strong>hiking123</strong>
                            {" · "}
                            <strong>levi</strong> / <strong>homebody</strong>
                            {" · "}
                            <strong>ben</strong> / <strong>yeehaw</strong>
                        </p>
                        <p className="auth-hint">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup">Sign up here</Link>.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
