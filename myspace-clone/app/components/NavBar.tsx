import Link from "next/link";

export default function NavBar() {
    const items = [
        { label: "Home", href: "/", isNew: false },
        { label: "Browse", href: "/", isNew: false },
        { label: "Search", href: "#search", isNew: false },
        { label: "Blog", href: "#blog", isNew: true },
        { label: "Music", href: "#music", isNew: false },
        { label: "Favorites", href: "#favorites", isNew: false },
        { label: "Invite", href: "#invite", isNew: false },
        { label: "Mail", href: "#mail", isNew: false },
        { label: "Forum", href: "#forum", isNew: false },
        { label: "Groups", href: "#groups", isNew: false },
        { label: "Events", href: "#events", isNew: false },
        { label: "Videos", href: "#videos", isNew: false },
        { label: "About", href: "#about", isNew: false },
    ];

    return (
        <nav className="nav-bar">
            {items.map((item, i) => (
                <span key={item.label} className="nav-item">
                    {item.href.startsWith("/") ? (
                        <Link href={item.href}>{item.label}</Link>
                    ) : (
                        <a href={item.href}>{item.label}</a>
                    )}
                    {item.isNew && <span className="new-badge">NEW!</span>}
                    {i < items.length - 1 && <span className="nav-sep">|</span>}
                </span>
            ))}
        </nav>
    );
}
