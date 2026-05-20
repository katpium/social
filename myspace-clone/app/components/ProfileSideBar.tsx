import EditPhoto from "./EditPhoto";
import EditableField from "./EditableField";

type ProfileSideBarProps = {
    username: string;
    name: string;
    status: string;
    bio: string;
    mood: string;
    photoUrl?: string;
    canEdit: boolean;
};

function hashString(s: string): number {
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function formatStats(username: string) {
    const viewsSeed = hashString(username);
    const loginSeed = hashString(username + "::login");
    const profileViews = 1000 + (viewsSeed % 999000);
    const daysAgo = loginSeed % 14;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const lastLogin = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    return {
        profileViews: profileViews.toLocaleString("en-US"),
        lastLogin,
    };
}

export default function ProfileSideBar({
    username,
    name,
    status,
    bio,
    mood,
    photoUrl,
    canEdit,
}: ProfileSideBarProps) {
    const { profileViews, lastLogin } = formatStats(username);

    return (
        <>
            <h2 className="profile-name">{name}</h2>

            <EditPhoto username={username} canEdit={canEdit} />

            <div className="profile-top">
                <img
                    src={photoUrl || "/profile.png"}
                    alt={`${name}'s photo`}
                    className="profile-photo"
                />
                <div className="profile-meta">
                    <p className="profile-status">
                        <EditableField
                            username={username}
                            field="status"
                            value={status}
                            canEdit={canEdit}
                            placeholder="(no status)"
                        />
                    </p>
                    <p className="profile-bio">
                        <EditableField
                            username={username}
                            field="bio"
                            value={bio}
                            canEdit={canEdit}
                            multiline
                            placeholder="(no bio)"
                        />
                    </p>
                </div>
            </div>

            <div className="online-row">
                <span className="online-icon">●</span>
                <span className="online-text">ONLINE!</span>
            </div>

            <p className="mood-row">
                <strong>Mood:</strong>{" "}
                <EditableField
                    username={username}
                    field="mood"
                    value={mood}
                    canEdit={canEdit}
                    placeholder="(no mood)"
                />
            </p>

            <p className="view-my">
                <strong>View my:</strong>
                <a href="#blog"> Blog </a>
                <a href="#pic"> Pics </a>
                <a href="#video"> Videos </a>
            </p>

            <div className="profile-stats">
                <p><strong>Last Login:</strong> {lastLogin}</p>
                <p><strong>Profile Views:</strong> {profileViews}</p>
            </div>
        </>
    );
}
