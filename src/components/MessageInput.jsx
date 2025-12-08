import { useState, useRef } from "react";

export default function MessageInput({ onSend, onTyping }) {
    const [text, setText] = useState("");
    const typingTimeout = useRef();

    function handleChange(e) {
        setText(e.target.value);
        onTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(()=> onTyping(false), 1000);
    }
    function handleSend() {
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
        onTyping(false);
    }
    function handleKey(e) {
        if (e.key === "Enter") handleSend();
    }

    return (
        <div className="inputRow">
            <input value={text} onChange={handleChange} onKeyDown={handleKey} placeholder="Type a message..." />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
