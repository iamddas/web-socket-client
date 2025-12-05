import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";

export default function App() {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);

        ws.onopen = () => {
            setMessages((m) => [
                ...m,
                { type: "notification", message: "Connected to server." },
            ]);
        };

        ws.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch (e) {
                data = { type: "message", username: "Server", message: String(event.data) };
            }
            setMessages((m) => [...m, data]);
        };

        ws.onerror = () => {
            setMessages((m) => [
                ...m,
                { type: "notification", message: "WebSocket error occurred." },
            ]);
        };

        ws.onclose = () => {
            setMessages((m) => [
                ...m,
                { type: "notification", message: "Disconnected from server." },
            ]);
        };

        return () => ws.close();
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>WebSocket Chat</h2>
            <div style={styles.userRow}>
                <input
                    style={styles.usernameInput}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
            </div>
            <ChatBox socket={socket} messages={messages} username={username} />
        </div>
    );
}

const styles = {
    container: {
        width: "400px",
        margin: "0 auto",
        paddingTop: "30px",
        fontFamily: "Arial",
    },
    title: {
        textAlign: "center",
    },
    userRow: {
        display: "flex",
        marginBottom: "10px",
    },
    usernameInput: {
        flex: 1,
        padding: "10px",
        border: "1px solid #ccc",
    },
};
