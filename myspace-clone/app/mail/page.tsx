import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "../components/header";
import NavBar from "../components/NavBar";
import {
    getInbox,
    type FriendRequest,
    type Message,
} from "../data/inbox";
import { getUserByUsername } from "../data/users";
import {
    approveFriendRequest,
    denyFriendRequest,
} from "../actions/inbox";

export default async function MailPage() {
    const session = await auth();
    const me = (session?.user as { username?: string } | undefined)?.username ?? null;
    if (!me) redirect("/login");

    const inbox = getInbox().filter((i) => i.to === me);
    const pendingRequests = inbox.filter(
        (i): i is FriendRequest =>
            i.type === "friend_request" && i.status === "pending"
    );
    const messages = inbox
        .filter((i): i is Message => i.type === "message")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
        <main>
            <Header />
            <NavBar />

            <div className="container">
                <section className="section-right">
                    <h2 className="box-title">Mail — Friend Requests</h2>

                    {pendingRequests.length === 0 ? (
                        <p className="blog-empty mail-empty">
                            <em>No pending friend requests.</em>
                        </p>
                    ) : (
                        <table className="mail-table">
                            <thead>
                                <tr>
                                    <th className="mail-check-col"></th>
                                    <th>Date</th>
                                    <th>Photo</th>
                                    <th>Confirmation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map((req) => {
                                    const sender = getUserByUsername(req.from);
                                    const senderName = sender?.name ?? req.from;
                                    return (
                                        <tr key={req.id}>
                                            <td className="mail-check-col">
                                                <input
                                                    type="checkbox"
                                                    aria-label="Select row"
                                                />
                                            </td>
                                            <td className="mail-date-col">
                                                {formatDate(req.createdAt)}
                                            </td>
                                            <td className="mail-photo-col">
                                                <Link href={`/users/${req.from}`}>
                                                    <img
                                                        src={
                                                            sender?.photoUrl ||
                                                            "/profile.png"
                                                        }
                                                        alt={senderName}
                                                        className="mail-photo"
                                                    />
                                                </Link>
                                            </td>
                                            <td className="mail-conf-col">
                                                <p className="mail-conf-text">
                                                    <Link
                                                        href={`/users/${req.from}`}
                                                    >
                                                        {senderName}
                                                    </Link>{" "}
                                                    wants to be your friend!
                                                </p>
                                                <div className="mail-actions">
                                                    <form
                                                        action={approveFriendRequest.bind(
                                                            null,
                                                            req.id
                                                        )}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="save-button"
                                                        >
                                                            Approve
                                                        </button>
                                                    </form>
                                                    <form
                                                        action={denyFriendRequest.bind(
                                                            null,
                                                            req.id
                                                        )}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="cancel-button"
                                                        >
                                                            Deny
                                                        </button>
                                                    </form>
                                                    <Link
                                                        href={`/users/${req.from}`}
                                                        className="cancel-button mail-msg-link"
                                                    >
                                                        Send Message
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    <h2 className="box-title mail-messages-title">Messages</h2>

                    {messages.length === 0 ? (
                        <p className="blog-empty mail-empty">
                            <em>No messages yet.</em>
                        </p>
                    ) : (
                        <ul className="mail-message-list">
                            {messages.map((m) => {
                                const fromUser = getUserByUsername(m.from);
                                return (
                                    <li key={m.id} className="mail-message">
                                        <p className="mail-message-meta">
                                            From{" "}
                                            <Link href={`/users/${m.from}`}>
                                                {fromUser?.name ?? m.from}
                                            </Link>{" "}
                                            · {formatDate(m.createdAt)}
                                        </p>
                                        <p className="mail-message-body">
                                            {m.body}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    const date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const time = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${date} ${time}`;
}
