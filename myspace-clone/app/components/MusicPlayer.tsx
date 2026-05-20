type Props = {
    title: string;
    url: string;
};

export default function MusicPlayer({ title, url }: Props) {
    return (
        <div className="music-player">
            <h3 className="music-title">♪ Now Playing ♪</h3>
            <p className="music-song">{title || "Profile Song"}</p>
            <audio controls src={url} preload="none" />
        </div>
    );
}
