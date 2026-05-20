import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Header() {
    const session = await auth();

    return (
        <>
        <header className="header">
            <Link href="/" className="logo">
                <span className="logo-icon">hey</span>
                <span className="logo-text">
                    <strong>spacehey</strong>
                    <em>a space for friends</em>
                </span>
            </Link>

            <form action="/search" className="search-bar">
                <span>Search Users:</span>
                <input type="text" name="q" defaultValue="" />
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="header-right">
                <a href="#help">Help</a>
                <span>|</span>
                {session?.user ? (
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <button type="submit" className="link-button">
                            LogOut
                        </button>
                    </form>
                ) : (
                    <Link href="/login">Login</Link>
                )}
            </div>
        </header>
        <div className="marquee-bar">
            <div className="marquee-track">
                <span>★ Welcome to spacehey — a space for friends ★</span>
                <span>NEW! Top 8 just got more dramatic</span>
                <span>♥ Tom says hi ♥</span>
                <span>Bulletin: Comic Sans is back, baby</span>
                <span>Don&apos;t forget to update your mood!</span>
                <span>★ ★ ★</span>
            </div>
        </div>
        </>
    );
}
