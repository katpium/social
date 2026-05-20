"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadPhoto } from "@/app/actions/upload-photo";

type Props = {
    username: string;
    canEdit: boolean;
};

export default function EditPhoto({ username, canEdit }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (!canEdit) return null;

    function handleClick() {
        inputRef.current?.click();
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("photo", file);

        startTransition(async () => {
            setError(null);
            const result = await uploadPhoto(username, formData);
            if (result.ok) {
                router.refresh();
            } else {
                setError(result.error ?? "Upload failed.");
            }
            if (inputRef.current) inputRef.current.value = "";
        });
    }

    return (
        <span className="edit-photo">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleChange}
                style={{ display: "none" }}
                disabled={isPending}
            />
            <button
                type="button"
                className="edit-link edit-button"
                onClick={handleClick}
                disabled={isPending}
            >
                {isPending ? "[uploading...]" : "[edit photo]"}
            </button>
            {error && <span className="edit-error">{error}</span>}
        </span>
    );
}
