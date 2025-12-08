import { useEffect, useState } from "react";
import Login from "./pages/Login";
import ChatLayout from "./ChatLayout";
import './App.css';

export default function App() {
    const [ws, setWs] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // keep ws null until login to attach username handshake
    }, []);

    if (!username) {
        return <Login onLogin={(name) => setUsername(name)} setWs={setWs} />;
    }

    return <ChatLayout username={username} ws={ws} setWs={setWs} />;
}
