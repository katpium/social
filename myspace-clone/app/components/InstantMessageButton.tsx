"use client";

import { useState } from "react";
import InstantMessage from "./InstantMessage";

type Props = {
    me: string;
    meName: string;
    target: string;
    targetName: string;
    targetPhoto?: string;
    enabled: boolean;
};

export default function InstantMessageButton({
    me,
    meName,
    target,
    targetName,
    targetPhoto,
    enabled,
}: Props) {
    const [open, setOpen] = useState(false);

    if (!enabled) {
        return (
            <li className="contact-stub">
                <button type="button" disabled title="Log in to send instant messages">
                    <span className="contact-icon">💬</span>
                    Instant Message
                </button>
            </li>
        );
    }

    return (
        <>
            <li>
                <button
                    type="button"
                    className="contact-button"
                    onClick={() => setOpen(true)}
                >
                    <span className="contact-icon">💬</span>
                    Instant Message
                </button>
            </li>
            {open && (
                <InstantMessage
                    me={me}
                    meName={meName}
                    target={target}
                    targetName={targetName}
                    targetPhoto={targetPhoto}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
