import { useEffect, useRef } from "react";

export default function MessageList({ messages, typingMap }) {
    const bottomRef = useRef();
    useEffect(()=> bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);
    return (
        <div className="messages">
            {messages.map((m, idx) => {
                if (m.system) return <div key={idx} className="system">{m.text}</div>;
                if (m.dm) return <div key={idx} className="dm"><strong>{m.from || m.username}</strong> (DM): {m.text}</div>;
                return <div key={idx} className="msg"><strong>{m.username || m.from}</strong>: {m.text}</div>;
            })}
            <div className="typing">
                {Object.entries(typingMap).filter(([k,v])=>v).map(([k]) => <span key={k}>{k} is typing…</span>)}
            </div>
            <div ref={bottomRef} />
        </div>
    );
}
