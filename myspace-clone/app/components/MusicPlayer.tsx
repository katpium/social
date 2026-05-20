"use client";

import { useEffect, useRef } from "react";

type Props = {
    title: string;
    url: string;
};

export default function MusicPlayer({ title, url }: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, [url]);

    return (
        <div className="music-player">
            <h3 className="music-title">♪ Now Playing ♪</h3>
            <p className="music-song">{title || "Profile Song"}</p>
            <audio ref={audioRef} controls src={url} preload="none" />
        </div>
    );
}
