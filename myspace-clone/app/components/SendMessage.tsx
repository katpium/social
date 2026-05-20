"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/actions/inbox";

type Props = {
    targetUsername: string;
    enabled: boolean;
};

export default function SendMessage({ targetUsername, enabled }: Props) {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const textRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    if (!enabled) {
        return (
            <li className="contact-stub">
                <button type="button" disabled title="Log in to send messages">
                    <span className="contact-icon">✉</span>
                    Send Message
                </button>
            </li>
        );
    }

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            await sendMessage(targetUsername, formData);
            setMsg("Sent!");
            setOpen(false);
            if (textRef.current) textRef.current.value = "";
            router.refresh();
            setTimeout(() => setMsg(null), 2500);
        });
    }

    return (
        <>
            <li>
                <button
                    type="button"
                    className="contact-button"
                    onClick={() => setOpen((o) => !o)}
                >
                    <span className="contact-icon">✉</span>
                    {open ? "Cancel Message" : "Send Message"}
                </button>
            </li>
            {open && (
                <li className="contact-send-msg-form">
                    <form action={handleSubmit}>
                        <textarea
                            ref={textRef}
                            name="body"
                            required
                            maxLength={2000}
                            placeholder="Write a message..."
                            rows={3}
                        />
                        <div className="contact-send-msg-actions">
                            <button
                                type="submit"
                                className="save-button"
                                disabled={isPending}
                            >
                                {isPending ? "Sending..." : "Send"}
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </li>
            )}
            {msg && <li className="contact-note">{msg}</li>}
        </>
    );
}
