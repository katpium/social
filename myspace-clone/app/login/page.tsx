import Header from "../components/header";
import NavBar from "../components/NavBar";
import { loginAction } from "./actions";

export default function LoginPage() {
    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <div className="about-box">
                        <h2 className="box-title">Member Login</h2>

                        <form action={loginAction} className="login-form">
                            <label>
                                Username:
                                <input
                                    name="username"
                                    type="text"
                                    required
                                />
                            </label>

                            <label>
                                Password:
                                <input
                                    name="password"
                                    type="password"
                                    required
                                />
                            </label>

                            <button type="submit" className="login-button">
                                Login
                            </button>
                        </form>

                        <p style={{ margin: "12px 8px", fontSize: "11px", color: "#666" }}>
                            Try: <strong>john</strong> / <strong>hiking123</strong>,{" "}
                            <strong>levi</strong> / <strong>homebody</strong>,{" "}
                            <strong>ben</strong> / <strong>yeehaw</strong>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
