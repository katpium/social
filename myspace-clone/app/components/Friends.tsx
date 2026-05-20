import Link from "next/link";
import { getUserByUsername } from "../data/users";

type FriendsProps = {
    name: string;
    friendUsernames: string[];
};

export default function Friends({ name, friendUsernames }: FriendsProps) {
    const friends = friendUsernames
        .map((u) => getUserByUsername(u))
        .filter((u): u is NonNullable<typeof u> => u !== undefined);

    return (
        <div className="friends-box">
            <h2 className="friends-title">
                {name}&apos;s Friend Space{" "}
                <a href="#all-friends" className="view-all">[view all]</a>
            </h2>

            <p className="friends-count">
                {name} has <strong>{friends.length}</strong> friends.
            </p>

            <ul className="friends-grid">
                {friends.map((friend) => (
                    <li key={friend.username} className="friend-card">
                        <Link href={`/users/${friend.username}`}>
                            <img src={friend.photoUrl || "/profile.png"} alt={friend.name} />
                            <span>{friend.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
