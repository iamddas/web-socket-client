import { useState, useRef } from "react";
import {Button, Input} from "reactstrap";
import SubmitBtn from "./utils/SubmitBtn";

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
        // Send on Enter, allow Shift+Enter for a newline (if using textarea)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
    return (
        <div className="inputRow">
            <Input value={text} onChange={handleChange} onKeyDown={handleKey} placeholder="Type a message..." />
            <SubmitBtn onClick={handleSend} label={'Send'}/>
        </div>
    );
}
