import Link from "next/link";
import Header from "../components/header";
import NavBar from "../components/NavBar";
import WelcomeSidebar from "../components/WelcomeSidebar";
import { signUpAction } from "./actions";

type Props = {
    searchParams: Promise<{ error?: string }>;
};

const ERRORS: Record<string, string> = {
    username: "Username must be 3-20 characters: lowercase letters, numbers, or underscores.",
    password: "Password must be at least 6 characters.",
    name: "Display name is required (1-50 characters).",
    taken: "That username is already taken — pick another.",
};

export default async function SignUpPage({ searchParams }: Props) {
    const { error } = await searchParams;
    const errorMsg = error ? ERRORS[error] ?? "Sign up failed." : null;

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <aside className="section-left">
                    <WelcomeSidebar
                        title="🎉 Join the Party 🎉"
                        subtitle="it's free, it's chaotic"
                        bullets={[
                            "🌟 Pick a username and dive in",
                            "🎀 Decorate your profile your way",
                            "🩷 Write blogs, drop comments, send mail",
                            "🦄 Tom will be your first friend",
                        ]}
                    />
                </aside>

                <section className="section-right">
                    <div className="auth-card">
                        <h2 className="auth-card-title">★ Create Your Account ★</h2>

                        {errorMsg && (
                            <p className="signup-error">{errorMsg}</p>
                        )}

                        <form action={signUpAction} className="auth-form">
                            <label>
                                Username
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    minLength={3}
                                    maxLength={20}
                                    pattern="[a-z0-9_]+"
                                    placeholder="lowercase, numbers, _"
                                />
                            </label>

                            <label>
                                Display name
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    maxLength={50}
                                    placeholder="What people will see"
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                />
                            </label>

                            <button type="submit" className="auth-submit">
                                Sign Up
                            </button>
                        </form>

                        <hr className="auth-divider" />

                        <p className="auth-hint">
                            Already have an account?{" "}
                            <Link href="/login">Log in instead</Link>.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
