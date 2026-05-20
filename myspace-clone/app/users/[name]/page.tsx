import type { CSSProperties } from "react";
import { auth } from "@/auth";
import Header from "../../components/header";
import NavBar from "../../components/NavBar";
import ProfileSideBar from "../../components/ProfileSideBar";
import ContactBox from "../../components/ContactBox";
import Profilebox from "../../components/Profilebox";
import ProfileEditor from "../../components/ProfileEditor";
import MusicPlayer from "../../components/MusicPlayer";
import StickerLayer from "../../components/StickerLayer";
import AboutBox from "../../components/AboutBox";
import BlogEntry from "../../components/BlogEntry";
import Friends from "../../components/Friends";
import Interests from "../../components/Interests";
import { getUserByUsername } from "../../data/users";
import { DEFAULT_THEME } from "../../data/theme-defaults";

type Props = {
    params: Promise<{
        name: string;
    }>;
};

export default async function UserPage({ params }: Props) {
    const { name } = await params;
    const user = getUserByUsername(name);

    if (!user) {
        return <h1>User does not exist.</h1>;
    }

    const session = await auth();
    const me = (session?.user as { username?: string } | undefined)?.username ?? null;
    const canEdit = me === user.username;

    const theme = user.theme ?? {};
    const bgPattern = theme.bgPattern && theme.bgPattern !== "none" ? theme.bgPattern : "";
    const mainClass = bgPattern ? `theme-pattern-${bgPattern}` : undefined;

    const mainStyle: CSSProperties & Record<string, string> = {};
    if (theme.bgColor) mainStyle.backgroundColor = theme.bgColor;
    if (theme.accentColor) mainStyle["--accent"] = theme.accentColor;
    if (theme.cardColor) mainStyle["--card-bg"] = theme.cardColor;
    if (theme.textColor) mainStyle["--text-color"] = theme.textColor;

    const stickers = user.stickers ?? [];

    return (
        <main className={mainClass} style={mainStyle}>
            <Header />
            <NavBar />

            <div className="container">
                <aside className="section-left">
                    <ProfileSideBar
                        username={user.username}
                        name={user.name}
                        status={user.status}
                        bio={user.bio}
                        mood={user.mood}
                        photoUrl={user.photoUrl}
                        canEdit={canEdit}
                    />
                    {user.music && (
                        <MusicPlayer
                            title={user.music.title}
                            url={user.music.url}
                        />
                    )}
                    <ContactBox
                        viewedUsername={user.username}
                        viewedName={user.name}
                    />
                </aside>

                <section className="section-right">
                    {canEdit ? (
                        <ProfileEditor
                            username={user.username}
                            currentStickers={stickers}
                            initialBgColor={theme.bgColor ?? DEFAULT_THEME.bgColor}
                            initialBgPattern={theme.bgPattern ?? DEFAULT_THEME.bgPattern}
                            initialAccentColor={theme.accentColor ?? DEFAULT_THEME.accentColor}
                            initialCardColor={theme.cardColor ?? DEFAULT_THEME.cardColor}
                            initialTextColor={theme.textColor ?? DEFAULT_THEME.textColor}
                            initialMusicTitle={user.music?.title ?? ""}
                            initialMusicUrl={user.music?.url ?? ""}
                        />
                    ) : (
                        <Profilebox />
                    )}
                    <BlogEntry username={user.username} name={user.name} />
                    <AboutBox
                        username={user.username}
                        name={user.name}
                        about={user.about}
                        answer={user.answer}
                        canEdit={canEdit}
                    />
                    <Friends
                        name={user.name}
                        friendUsernames={user.friends}
                    />
                    <Interests
                        username={user.username}
                        name={user.name}
                        interests={user.interests}
                        canEdit={canEdit}
                    />
                </section>

                <StickerLayer
                    username={user.username}
                    initialStickers={stickers}
                    canEdit={canEdit}
                />
            </div>
        </main>
    );
}
