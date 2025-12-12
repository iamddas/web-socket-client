import { useState } from "react";
import Message from "./pages/Message";
import {Input} from "reactstrap";
import SubmitBtn from "./components/utils/SubmitBtn";

export default function ChatBox({ socket, messages, username }) {
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!socket) return;
        if (socket.readyState !== WebSocket.OPEN) return;
        if (input.trim() === "") return;

        const payload = {
            type: "message",
            username: username || "Anonymous",
            message: input.trim(),
        };

        try {
            socket.send(JSON.stringify(payload));
        } catch (e) {
            // noop
        }
        setInput("");
    };

    return (
        <div>
            <div style={styles.box}>
                {messages.map((msg, index) => (
                    <Message key={index} data={msg} />
                ))}
            </div>

            <div style={styles.inputRow}>
                <Input
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type message..."
                />
                <SubmitBtn style={styles.button} onClick={sendMessage} label={'Send'}/>
            </div>
        </div>
    );
}

const styles = {
    box: {
        height: "350px",
        border: "1px solid #ccc",
        padding: "10px",
        overflowY: "scroll",
        marginBottom: "10px",
        background: "#f8f8f8",
    },
    inputRow: {
        display: "flex",
        gap: "10px",
    },
    input: {
        flex: 1,
        padding: "10px",
    },
    button: {
        padding: "10px 20px",
        cursor: "pointer",
        background: "#4caf50",
        border: "none",
        color: "white",
    },
};
