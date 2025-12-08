import { useState } from "react";

export default function Login({ onLogin, setWs }) {
    const [name, setName] = useState("");

    const handleLogin = () => {
        const ws = new WebSocket("ws://localhost:3000");
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "login", username: name }));
        };
        // minimal handlers here; ChatLayout will attach more
        setWs(ws);
        onLogin(name);
    };

    return (
        <div className="center">
            <div className="card">
                <h2>Enter your name</h2>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" />
                <button onClick={handleLogin} disabled={!name.trim()}>Join Chat</button>
            </div>
        </div>
    );
}
