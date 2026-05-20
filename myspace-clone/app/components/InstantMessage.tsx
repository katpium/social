"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { sendMessage, getConversation } from "@/app/actions/inbox";

type ImMessage = {
    id: string;
    from: string;
    to: string;
    body: string;
    createdAt: string;
};

type Props = {
    me: string;
    meName: string;
    target: string;
    targetName: string;
    targetPhoto?: string;
    onClose: () => void;
};

export default function InstantMessage({
    me,
    meName,
    target,
    targetName,
    targetPhoto,
    onClose,
}: Props) {
    const [messages, setMessages] = useState<ImMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);
    const [windowState, setWindowState] = useState<
        "normal" | "minimized" | "maximized"
    >("normal");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            const msgs = (await getConversation(target)) as ImMessage[];
            if (!cancelled) setMessages(msgs);
        }
        load();
        const id = window.setInterval(load, 3000);
        return () => {
            cancelled = true;
            window.clearInterval(id);
        };
    }, [target]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function send() {
        const body = draft.trim();
        if (!body) return;
        setSending(true);
        const fd = new FormData();
        fd.append("body", body);
        await sendMessage(target, fd);
        const msgs = (await getConversation(target)) as ImMessage[];
        setMessages(msgs);
        setDraft("");
        setSending(false);
    }

    function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    const isMinimized = windowState === "minimized";
    const isMaximized = windowState === "maximized";

    function toggleMinimize() {
        setWindowState((s) => (s === "minimized" ? "normal" : "minimized"));
    }

    function toggleMaximize() {
        setWindowState((s) => (s === "maximized" ? "normal" : "maximized"));
    }

    return (
        <div
            className={
                "im-window" +
                (isMinimized ? " im-minimized" : "") +
                (isMaximized ? " im-maximized" : "")
            }
            role="dialog"
            aria-label={`Chat with ${targetName}`}
        >
            <div
                className="im-titlebar"
                onDoubleClick={toggleMaximize}
            >
                <span className="im-title">{target} - MySpace.IM Person</span>
                <div className="im-window-controls">
                    <button
                        type="button"
                        title={isMinimized ? "Restore" : "Minimize"}
                        onClick={toggleMinimize}
                    >
                        _
                    </button>
                    <button
                        type="button"
                        title={isMaximized ? "Restore" : "Maximize"}
                        onClick={toggleMaximize}
                    >
                        {isMaximized ? "❐" : "□"}
                    </button>
                    <button
                        type="button"
                        title="Close"
                        onClick={onClose}
                        className="im-close-btn"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="im-menubar">
                <span>File</span>
                <span>Edit</span>
                <span>People</span>
                <span>MySpace</span>
                <span>Help</span>
            </div>

            <div className="im-toolbar">
                <button type="button" className="im-tool">View</button>
                <button type="button" className="im-tool">Add</button>
                <button type="button" className="im-tool">Block</button>
                <button type="button" className="im-tool">File</button>
                <button type="button" className="im-tool">Send</button>
                <div className="im-toolbar-spacer" />
                <img
                    src={targetPhoto || "/profile.png"}
                    alt={targetName}
                    className="im-tool-photo"
                />
            </div>

            <div className="im-conv-header">{targetName}</div>

            <div className="im-conversation" ref={scrollRef}>
                {messages.length === 0 ? (
                    <p className="im-empty">
                        <em>No messages yet. Say hi!</em>
                    </p>
                ) : (
                    messages.map((m) => {
                        const mine = m.from === me;
                        return (
                            <p
                                key={m.id}
                                className={"im-msg " + (mine ? "im-me" : "im-them")}
                            >
                                <span className="im-author">
                                    {mine ? meName || me : targetName}:
                                </span>{" "}
                                {m.body}
                            </p>
                        );
                    })
                )}
            </div>

            <div className="im-format">
                <button type="button" className="im-fmt-btn" title="Bold">
                    <b>B</b>
                </button>
                <button type="button" className="im-fmt-btn" title="Italic">
                    <i>I</i>
                </button>
                <button type="button" className="im-fmt-btn" title="Underline">
                    <u>U</u>
                </button>
                <select className="im-fmt-select" disabled defaultValue="Arial">
                    <option>Arial</option>
                </select>
                <select className="im-fmt-select" disabled defaultValue="9">
                    <option>9</option>
                </select>
                <button type="button" className="im-fmt-btn" title="Emoji">
                    😊
                </button>
            </div>

            <div className="im-input-row">
                <textarea
                    className="im-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Type a message..."
                    rows={3}
                    disabled={sending}
                />
                <button
                    type="button"
                    className="im-send"
                    onClick={send}
                    disabled={sending || !draft.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
