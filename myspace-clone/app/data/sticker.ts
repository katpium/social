export type StickerPlacement = {
    id: string;
    emoji: string;
    imageUrl?: string;
    x: number;
    y: number;
    size: number;
    rotation?: number;
    opacity?: number;
    wiggle?: boolean;
};
