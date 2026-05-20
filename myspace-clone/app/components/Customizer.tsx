"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { updateUserCustomization } from "@/app/actions/customize";
import { setUserStickers } from "@/app/actions/stickers";
import { uploadMusic } from "@/app/actions/upload-music";
import { uploadSticker } from "@/app/actions/upload-sticker";
import { DEFAULT_THEME } from "@/app/data/theme-defaults";
import type { StickerPlacement } from "@/app/data/sticker";

const STICKER_LIBRARY = [
    "🌟", "💖", "✨", "🌈", "🦄", "🎀", "💀", "🔥",
    "🎸", "☮️", "💿", "📼", "🌙", "⭐", "🩷", "🍓",
    "👾", "🦋", "🌸", "💎", "🐉", "🍒", "🎮", "🎧",
    "🧁", "💌", "🪩", "🐾", "🌺", "🐱", "🐻", "🌻",
];

const PATTERNS = [
    { value: "none", label: "None" },
    { value: "stars", label: "Stars" },
    { value: "hearts", label: "Hearts" },
    { value: "checker", label: "Checker" },
    { value: "stripes", label: "Stripes" },
];

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
    onClose: () => void;
};

export default function Customizer({
    username,
    currentStickers,
    initialBgColor,
    initialBgPattern,
    initialAccentColor,
    initialAccentShadeColor,
    initialAccentTextColor,
    initialCardColor,
    initialTextColor,
    initialMusicTitle,
    initialMusicUrl,
    onClose,
}: Props) {
    const [bgColor, setBgColor] = useState(initialBgColor);
    const [bgPattern, setBgPattern] = useState(initialBgPattern);
    const [accentColor, setAccentColor] = useState(initialAccentColor);
    const [accentShadeColor, setAccentShadeColor] = useState(initialAccentShadeColor);
    const [accentTextColor, setAccentTextColor] = useState(initialAccentTextColor);
    const [cardColor, setCardColor] = useState(initialCardColor);
    const [textColor, setTextColor] = useState(initialTextColor);
    const [musicTitle, setMusicTitle] = useState(initialMusicTitle);
    const [musicUrl, setMusicUrl] = useState(initialMusicUrl);
    const [customSticker, setCustomSticker] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [uploadMsg, setUploadMsg] = useState<string | null>(null);
    const [stickerMsg, setStickerMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isUploading, startUpload] = useTransition();
    const [isStickerWorking, startStickerWork] = useTransition();
    const musicFileInputRef = useRef<HTMLInputElement>(null);
    const stickerImageInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    function nextPlacement(): { x: number; y: number } {
        const i = currentStickers.length;
        return { x: 200 + (i % 5) * 40, y: 60 + Math.floor(i / 5) * 40 };
    }

    const themeIsDefault =
        bgColor === DEFAULT_THEME.bgColor &&
        bgPattern === DEFAULT_THEME.bgPattern &&
        accentColor === DEFAULT_THEME.accentColor &&
        accentShadeColor === DEFAULT_THEME.accentShadeColor &&
        accentTextColor === DEFAULT_THEME.accentTextColor &&
        cardColor === DEFAULT_THEME.cardColor &&
        textColor === DEFAULT_THEME.textColor;

    function resetTheme() {
        setBgColor(DEFAULT_THEME.bgColor);
        setBgPattern(DEFAULT_THEME.bgPattern);
        setAccentColor(DEFAULT_THEME.accentColor);
        setAccentShadeColor(DEFAULT_THEME.accentShadeColor);
        setAccentTextColor(DEFAULT_THEME.accentTextColor);
        setCardColor(DEFAULT_THEME.cardColor);
        setTextColor(DEFAULT_THEME.textColor);
        setMsg("Theme reset — click Save to apply.");
    }

    function matchShadeToAccent() {
        setAccentShadeColor(accentColor);
    }

    function addSticker(emoji: string) {
        startStickerWork(async () => {
            const pos = nextPlacement();
            const newPlacement: StickerPlacement = {
                id: `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                emoji,
                x: pos.x,
                y: pos.y,
                size: 48,
            };
            const result = await setUserStickers(username, [...currentStickers, newPlacement]);
            if (result.ok) {
                setStickerMsg(null);
                router.refresh();
            } else {
                setStickerMsg(result.error ?? "Failed to add sticker.");
            }
        });
    }

    function handleStickerImage(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("sticker", file);
        startStickerWork(async () => {
            setStickerMsg(null);
            const upload = await uploadSticker(username, formData);
            if (!upload.ok || !upload.url) {
                setStickerMsg(upload.error ?? "Upload failed.");
                if (stickerImageInputRef.current) stickerImageInputRef.current.value = "";
                return;
            }
            const pos = nextPlacement();
            const newPlacement: StickerPlacement = {
                id: `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                emoji: "",
                imageUrl: upload.url,
                x: pos.x,
                y: pos.y,
                size: 120,
            };
            const result = await setUserStickers(username, [...currentStickers, newPlacement]);
            if (result.ok) router.refresh();
            else setStickerMsg(result.error ?? "Failed to add sticker.");
            if (stickerImageInputRef.current) stickerImageInputRef.current.value = "";
        });
    }

    function clearStickers() {
        if (!window.confirm("Remove all stickers from your profile?")) return;
        startStickerWork(async () => {
            const result = await setUserStickers(username, []);
            if (result.ok) {
                setStickerMsg(null);
                router.refresh();
            } else {
                setStickerMsg(result.error ?? "Failed to clear stickers.");
            }
        });
    }

    function handleMusicFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("music", file);
        startUpload(async () => {
            setUploadMsg(null);
            const result = await uploadMusic(username, formData);
            if (result.ok && result.url) {
                setMusicUrl(result.url);
                if (!musicTitle.trim()) {
                    setMusicTitle(file.name.replace(/\.[^.]+$/, ""));
                }
                setUploadMsg("Uploaded! Click Save to apply.");
            } else {
                setUploadMsg(result.error ?? "Upload failed.");
            }
            if (musicFileInputRef.current) musicFileInputRef.current.value = "";
        });
    }

    function save() {
        startTransition(async () => {
            const trimmedUrl = musicUrl.trim();
            const result = await updateUserCustomization(username, {
                theme: {
                    bgColor,
                    bgPattern,
                    accentColor,
                    accentShadeColor,
                    accentTextColor,
                    cardColor,
                    textColor,
                },
                music: trimmedUrl
                    ? { url: trimmedUrl, title: musicTitle.trim() }
                    : null,
            });
            if (result.ok) {
                setMsg("Saved!");
                router.refresh();
            } else {
                setMsg(result.error ?? "Save failed.");
            }
        });
    }

    return (
        <div className="customizer">
            <h2 className="customizer-title">
                ★ Customize Your Profile ★
                <button
                    type="button"
                    className="customizer-close"
                    onClick={onClose}
                    aria-label="Close customizer"
                >
                    ×
                </button>
            </h2>

            <fieldset>
                <legend>Page Background (wallpaper)</legend>
                <label>
                    Color
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                    />
                    <code>{bgColor}</code>
                </label>
                <label>
                    Pattern
                    <select
                        value={bgPattern}
                        onChange={(e) => setBgPattern(e.target.value)}
                    >
                        {PATTERNS.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </label>
            </fieldset>

            <fieldset>
                <legend>Profile Card</legend>
                <label>
                    Card background
                    <input
                        type="color"
                        value={cardColor}
                        onChange={(e) => setCardColor(e.target.value)}
                    />
                    <code>{cardColor}</code>
                </label>
                <label>
                    Text color
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                    />
                    <code>{textColor}</code>
                </label>
                <p className="customizer-hint">
                    Card = the white area your profile lives in. Text color affects body text;
                    box headers keep their accent color.
                </p>
            </fieldset>

            <fieldset>
                <legend>Accent (box headers)</legend>
                <label>
                    Top color
                    <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                    />
                    <code>{accentColor}</code>
                </label>
                <label>
                    Bottom shade
                    <input
                        type="color"
                        value={accentShadeColor}
                        onChange={(e) => setAccentShadeColor(e.target.value)}
                    />
                    <code>{accentShadeColor}</code>
                    <button
                        type="button"
                        className="cancel-button customizer-inline-btn"
                        onClick={matchShadeToAccent}
                        disabled={accentShadeColor === accentColor}
                        title="Make the header a single flat color"
                    >
                        Flat
                    </button>
                </label>
                <label>
                    Header text
                    <input
                        type="color"
                        value={accentTextColor}
                        onChange={(e) => setAccentTextColor(e.target.value)}
                    />
                    <code>{accentTextColor}</code>
                </label>
                <p className="customizer-hint">
                    Top and bottom shade make the gradient. Pick the same color for a flat header,
                    or click <strong>Flat</strong> to copy the top color down.
                </p>
            </fieldset>

            <div className="customizer-theme-actions">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={resetTheme}
                    disabled={themeIsDefault}
                    title={themeIsDefault ? "Already at defaults" : "Reset background and accent to the original palette"}
                >
                    Reset Theme to Defaults
                </button>
            </div>

            <fieldset>
                <legend>Profile Song</legend>
                <label>
                    Title
                    <input
                        type="text"
                        value={musicTitle}
                        onChange={(e) => setMusicTitle(e.target.value)}
                        placeholder="Song name"
                    />
                </label>
                <label>
                    Audio URL
                    <input
                        type="url"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        placeholder="https://.../song.mp3"
                    />
                </label>
                <label>
                    Or upload
                    <input
                        ref={musicFileInputRef}
                        type="file"
                        accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/x-wav,audio/wave"
                        onChange={handleMusicFile}
                        disabled={isUploading}
                    />
                </label>
                <p className="customizer-hint">
                    Paste a direct .mp3/.ogg/.wav URL, or upload one (max 20 MB).
                    Leave URL blank to remove the song.
                </p>
                {(isUploading || uploadMsg) && (
                    <p className="customizer-hint">
                        {isUploading ? "Uploading..." : uploadMsg}
                    </p>
                )}
            </fieldset>

            <fieldset>
                <legend>Stickers</legend>
                <p className="customizer-hint">
                    Click an emoji to drop it on your profile. Drag to move, corner handle to
                    resize, click a sticker to open its rotation/opacity/wiggle controls.
                </p>
                <div className="sticker-picker">
                    {STICKER_LIBRARY.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className="sticker-option"
                            onClick={() => addSticker(s)}
                            disabled={isStickerWorking}
                            title={`Add ${s} to your profile`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <label className="customizer-custom-sticker">
                    Custom text/emoji
                    <input
                        type="text"
                        maxLength={8}
                        value={customSticker}
                        onChange={(e) => setCustomSticker(e.target.value)}
                        placeholder="any emoji or short text"
                    />
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                            const v = customSticker.trim();
                            if (!v) return;
                            addSticker(v);
                            setCustomSticker("");
                        }}
                        disabled={!customSticker.trim() || isStickerWorking}
                    >
                        Add
                    </button>
                </label>
                <label className="customizer-custom-sticker">
                    Upload image
                    <input
                        ref={stickerImageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleStickerImage}
                        disabled={isStickerWorking}
                    />
                </label>
                <p className="customizer-hint customizer-sticker-summary">
                    On your profile: <strong>{currentStickers.length}</strong> sticker
                    {currentStickers.length === 1 ? "" : "s"}.
                    {currentStickers.length > 0 && (
                        <button
                            type="button"
                            className="cancel-button customizer-clear-stickers"
                            onClick={clearStickers}
                            disabled={isStickerWorking}
                        >
                            Clear all
                        </button>
                    )}
                </p>
                {stickerMsg && (
                    <p className="customizer-hint customizer-sticker-error">{stickerMsg}</p>
                )}
            </fieldset>

            <div className="customizer-actions">
                <button
                    type="button"
                    className="save-button"
                    onClick={save}
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save Customization"}
                </button>
                <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Close
                </button>
                {msg && <span className="customizer-msg">{msg}</span>}
            </div>
        </div>
    );
}
