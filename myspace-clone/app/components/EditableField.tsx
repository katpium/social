"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserField } from "@/app/actions/update-user";

type Props = {
    username: string;
    field: string;
    value: string;
    canEdit: boolean;
    multiline?: boolean;
    placeholder?: string;
};

export default function EditableField({
    username,
    field,
    value,
    canEdit,
    multiline,
    placeholder,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [current, setCurrent] = useState(value);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function save() {
        startTransition(async () => {
            const result = await updateUserField(username, field, draft);
            if (result.ok) {
                setCurrent(draft);
                setEditing(false);
                setError(null);
                router.refresh();
            } else {
                setError(result.error ?? "Save failed.");
            }
        });
    }

    function cancel() {
        setDraft(current);
        setEditing(false);
        setError(null);
    }

    if (!editing) {
        return (
            <span className="editable">
                <span className={current ? "editable-value" : "editable-empty"}>
                    {current || <em>{placeholder ?? "(empty)"}</em>}
                </span>
                {canEdit && (
                    <button
                        type="button"
                        className="edit-link edit-button"
                        onClick={() => setEditing(true)}
                    >
                        [edit]
                    </button>
                )}
            </span>
        );
    }

    return (
        <span className="editable editing">
            {multiline ? (
                <textarea
                    className="edit-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    disabled={isPending}
                />
            ) : (
                <input
                    className="edit-input"
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={isPending}
                />
            )}
            <button
                type="button"
                className="save-button"
                onClick={save}
                disabled={isPending}
            >
                {isPending ? "Saving..." : "Save"}
            </button>
            <button
                type="button"
                className="cancel-button"
                onClick={cancel}
                disabled={isPending}
            >
                Cancel
            </button>
            {error && <span className="edit-error">{error}</span>}
        </span>
    );
}
