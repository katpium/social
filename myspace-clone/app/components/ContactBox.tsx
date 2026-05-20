import { auth } from "@/auth";
import { getUserByUsername } from "../data/users";
import {
    toggleFriend,
    toggleFavorite,
    toggleBlock,
} from "../actions/social";

type Props = {
    viewedUsername: string;
    viewedName: string;
};

export default async function ContactBox({ viewedUsername, viewedName }: Props) {
    const session = await auth();
    const me = (session?.user as { username?: string } | undefined)?.username ?? null;
    const isSelf = me === viewedUsername;
    const isLoggedIn = !!me;

    const meUser = me ? getUserByUsername(me) : null;
    const isFriend = !!meUser?.friends.includes(viewedUsername);
    const isFavorite = !!meUser?.favorites?.includes(viewedUsername);
    const isBlocked = !!meUser?.blocked?.includes(viewedUsername);

    const canAct = isLoggedIn && !isSelf;

    return (
        <div className="contact-box">
            <h2 className="contact-title">Contacting {viewedName}</h2>

            {isSelf && (
                <p className="contact-note">This is your profile.</p>
            )}
            {!isLoggedIn && (
                <p className="contact-note">
                    <a href="/login">Log in</a> to contact users.
                </p>
            )}

            <ul className="contact-list">
                <ActionItem
                    enabled={canAct}
                    action={toggleFriend.bind(null, viewedUsername)}
                    icon="⊕"
                    label={isFriend ? "Remove Friend" : "Add to Friends"}
                    active={isFriend}
                />
                <ActionItem
                    enabled={canAct}
                    action={toggleFavorite.bind(null, viewedUsername)}
                    icon="☆"
                    label={isFavorite ? "Remove Favorite" : "Add to Favorites"}
                    active={isFavorite}
                />
                <StubItem icon="✉" label="Send Message" />
                <StubItem icon="➤" label="Forward to Friend" />
                <StubItem icon="💬" label="Instant Message" />
                <ActionItem
                    enabled={canAct}
                    action={toggleBlock.bind(null, viewedUsername)}
                    icon="⛔"
                    label={isBlocked ? "Unblock User" : "Block User"}
                    active={isBlocked}
                />
                <StubItem icon="👪" label="Add to Group" />
                <StubItem icon="★" label="Rank User" />
            </ul>
        </div>
    );
}

type ActionItemProps = {
    enabled: boolean;
    action: () => Promise<unknown>;
    icon: string;
    label: string;
    active: boolean;
};

function ActionItem({ enabled, action, icon, label, active }: ActionItemProps) {
    if (!enabled) return <StubItem icon={icon} label={label} />;
    return (
        <li className={active ? "contact-active" : ""}>
            <form action={action}>
                <button type="submit" className="contact-button">
                    <span className="contact-icon">{icon}</span>
                    {label}
                </button>
            </form>
        </li>
    );
}

function StubItem({ icon, label }: { icon: string; label: string }) {
    return (
        <li className="contact-stub">
            <button type="button" disabled title="Not implemented yet">
                <span className="contact-icon">{icon}</span>
                {label}
            </button>
        </li>
    );
}
