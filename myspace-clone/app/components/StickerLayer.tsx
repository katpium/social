"use client";

import {
    useEffect,
    useRef,
    useState,
    useTransition,
    type PointerEvent,
} from "react";
import { useRouter } from "next/navigation";
import { setUserStickers } from "@/app/actions/stickers";
import type { StickerPlacement } from "@/app/data/sticker";

type Props = {
    username: string;
    initialStickers: StickerPlacement[];
    canEdit: boolean;
};

type Drag = {
    id: string;
    mode: "move" | "resize";
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
    startSize: number;
    moved: boolean;
};

const MIN_SIZE = 16;
const MAX_SIZE = 400;
const DRAG_THRESHOLD = 3;

export default function StickerLayer({ username, initialStickers, canEdit }: Props) {
    const [stickers, setStickers] = useState<StickerPlacement[]>(initialStickers);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [, startTransition] = useTransition();
    const router = useRouter();

    const stickersRef = useRef<StickerPlacement[]>(initialStickers);
    const dragRef = useRef<Drag | null>(null);

    useEffect(() => {
        setStickers(initialStickers);
        stickersRef.current = initialStickers;
    }, [initialStickers]);

    useEffect(() => {
        if (!canEdit || !selectedId) return;
        function onDocPointerDown(e: globalThis.PointerEvent) {
            const target = e.target as HTMLElement | null;
            if (target && !target.closest(".sticker-placement")) {
                setSelectedId(null);
            }
        }
        document.addEventListener("pointerdown", onDocPointerDown);
        return () => document.removeEventListener("pointerdown", onDocPointerDown);
    }, [canEdit, selectedId]);

    function persist(next: StickerPlacement[]) {
        startTransition(async () => {
            const result = await setUserStickers(username, next);
            if (result.ok) router.refresh();
        });
    }

    function updateSticker(id: string, patch: Partial<StickerPlacement>, persistNow = false) {
        const next = stickersRef.current.map((s) =>
            s.id === id ? { ...s, ...patch } : s
        );
        stickersRef.current = next;
        setStickers(next);
        if (persistNow) persist(next);
    }

    function handlePointerDown(
        e: PointerEvent<HTMLElement>,
        sticker: StickerPlacement,
        mode: "move" | "resize"
    ) {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = {
            id: sticker.id,
            mode,
            pointerX: e.clientX,
            pointerY: e.clientY,
            startX: sticker.x,
            startY: sticker.y,
            startSize: sticker.size,
            moved: false,
        };
    }

    function handlePointerMove(e: PointerEvent<HTMLElement>) {
        const drag = dragRef.current;
        if (!drag) return;
        const dx = e.clientX - drag.pointerX;
        const dy = e.clientY - drag.pointerY;
        if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
            drag.moved = true;
        }
        if (!drag.moved) return;

        setStickers((prev) => {
            const next = prev.map((s) => {
                if (s.id !== drag.id) return s;
                if (drag.mode === "move") {
                    return { ...s, x: drag.startX + dx, y: drag.startY + dy };
                }
                const delta = (dx + dy) / 2;
                const size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, drag.startSize + delta));
                return { ...s, size };
            });
            stickersRef.current = next;
            return next;
        });
    }

    function handlePointerUp(e: PointerEvent<HTMLElement>) {
        const drag = dragRef.current;
        if (!drag) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (drag.moved) {
            persist(stickersRef.current);
        } else {
            setSelectedId(drag.id);
        }
        dragRef.current = null;
    }

    function deleteSticker(id: string) {
        const next = stickers.filter((s) => s.id !== id);
        setStickers(next);
        stickersRef.current = next;
        setSelectedId(null);
        persist(next);
    }

    return (
        <div className={"sticker-layer" + (canEdit ? " editable" : "")}>
            {stickers.map((sticker) => {
                const rotation = sticker.rotation ?? 0;
                const opacity = sticker.opacity ?? 1;
                const wiggle = sticker.wiggle === true;
                const isSelected = canEdit && selectedId === sticker.id;
                return (
                    <div
                        key={sticker.id}
                        className={
                            "sticker-placement" + (isSelected ? " selected" : "")
                        }
                        style={{ left: sticker.x, top: sticker.y }}
                    >
                        <div
                            className="sticker-transform"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                opacity,
                            }}
                        >
                            {sticker.imageUrl ? (
                                <img
                                    src={sticker.imageUrl}
                                    alt=""
                                    draggable={false}
                                    className={
                                        "sticker-image" + (wiggle ? " wiggle" : "")
                                    }
                                    style={{ width: sticker.size, height: "auto" }}
                                    onPointerDown={
                                        canEdit
                                            ? (e) => handlePointerDown(e, sticker, "move")
                                            : undefined
                                    }
                                    onPointerMove={canEdit ? handlePointerMove : undefined}
                                    onPointerUp={canEdit ? handlePointerUp : undefined}
                                />
                            ) : (
                                <span
                                    className={
                                        "sticker-emoji" + (wiggle ? " wiggle" : "")
                                    }
                                    style={{ fontSize: sticker.size }}
                                    onPointerDown={
                                        canEdit
                                            ? (e) => handlePointerDown(e, sticker, "move")
                                            : undefined
                                    }
                                    onPointerMove={canEdit ? handlePointerMove : undefined}
                                    onPointerUp={canEdit ? handlePointerUp : undefined}
                                >
                                    {sticker.emoji}
                                </span>
                            )}
                        </div>
                        {canEdit && (
                            <>
                                <button
                                    type="button"
                                    className="sticker-delete"
                                    onClick={() => deleteSticker(sticker.id)}
                                    title="Delete sticker"
                                >
                                    ×
                                </button>
                                <span
                                    className="sticker-resize"
                                    role="button"
                                    aria-label="Resize sticker"
                                    title="Drag to resize"
                                    onPointerDown={(e) =>
                                        handlePointerDown(e, sticker, "resize")
                                    }
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                >
                                    ⤡
                                </span>
                            </>
                        )}
                        {isSelected && (
                            <div
                                className="sticker-toolbar"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <label>
                                    Rot
                                    <input
                                        type="range"
                                        min={0}
                                        max={360}
                                        value={rotation}
                                        onChange={(e) =>
                                            updateSticker(sticker.id, {
                                                rotation: parseInt(e.target.value, 10),
                                            })
                                        }
                                        onPointerUp={() => persist(stickersRef.current)}
                                        onKeyUp={() => persist(stickersRef.current)}
                                    />
                                    <span className="sticker-toolbar-value">
                                        {rotation}°
                                    </span>
                                </label>
                                <label>
                                    Opacity
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        value={Math.round(opacity * 100)}
                                        onChange={(e) =>
                                            updateSticker(sticker.id, {
                                                opacity:
                                                    parseInt(e.target.value, 10) / 100,
                                            })
                                        }
                                        onPointerUp={() => persist(stickersRef.current)}
                                        onKeyUp={() => persist(stickersRef.current)}
                                    />
                                    <span className="sticker-toolbar-value">
                                        {Math.round(opacity * 100)}%
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className={
                                        "sticker-toolbar-btn" +
                                        (wiggle ? " on" : "")
                                    }
                                    onClick={() =>
                                        updateSticker(
                                            sticker.id,
                                            { wiggle: !wiggle },
                                            true
                                        )
                                    }
                                    title="Toggle gentle shake animation"
                                >
                                    Wiggle {wiggle ? "✓" : ""}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
