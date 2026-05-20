"use client";

import { useState } from "react";
import Customizer from "./Customizer";
import type { StickerPlacement } from "@/app/data/sticker";

type Props = {
    username: string;
    currentStickers: StickerPlacement[];
    initialBgColor: string;
    initialBgPattern: string;
    initialAccentColor: string;
    initialAccentShadeColor: string;
    initialAccentTextColor: string;
    initialCardColor: string;
    initialTextColor: string;
    initialMusicTitle: string;
    initialMusicUrl: string;
};

export default function ProfileEditor(props: Props) {
    const [open, setOpen] = useState(false);

    if (!open) {
        return (
            <button
                type="button"
                className="profile-box profile-box-trigger"
                onClick={() => setOpen(true)}
            >
                <h2>Edit Your Profile</h2>
            </button>
        );
    }

    return <Customizer {...props} onClose={() => setOpen(false)} />;
}
