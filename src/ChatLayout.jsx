import { useEffect, useState, useRef } from "react";
import RoomsList from "./components/RoomsList";
import UsersList from "./components/UsersList";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

export default function ChatLayout({ username, ws, setWs }) {
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState("lobby");
    const [messages, setMessages] = useState([]); // messages for current room
    const [typingMap, setTypingMap] = useState({}); // {username: true}
    const [dmTarget, setDmTarget] = useState(null);
    const darkPref = useRef(false);
    const wsRef = useRef(ws);

    useEffect(() => {
        // if ws was created at login step, attach event handlers
        if (!wsRef.current) return;
        const socket = wsRef.current;

        socket.onopen = () => {
            setConnected(true);
            // login message already sent at login step, but if not, send again
            socket.send(JSON.stringify({ type: "login", username }));
        };

        socket.onmessage = (ev) => {
            let data;
            try { data = JSON.parse(ev.data); } catch (e) { return; }
            if (data.type === "login_success") {
                setUsers(data.users || []);
                setRooms(data.rooms || []);
                setCurrentRoom(data.room || "lobby");
            } else if (data.type === "presence") {
                setUsers(data.users || []);
            } else if (data.type === "room_list") {
                setRooms(data.rooms || []);
            } else if (data.type === "notification") {
                setMessages((m) => [...m, { system: true, text: data.text }]);
            } else if (data.type === "history") {
                // if history of a room
                if (data.room === currentRoom) setMessages(data.messages || []);
                else {
                    // ignore or cache per room (simple approach: replace)
                }
            } else if (data.type === "room_message") {
                if (data.room === currentRoom) setMessages((m) => [...m, { username: data.username, text: data.text, ts: data.ts }]);
            } else if (data.type === "dm_message") {
                // open DM panel or show as notification
                setMessages((m) => [...m, { dm: true, from: data.from, text: data.text, ts: data.ts }]);
            } else if (data.type === "typing") {
                setTypingMap((t) => ({ ...t, [data.username]: data.isTyping }));
                // clear after 5s if still true (safety)
                if (data.isTyping) {
                    setTimeout(() => setTypingMap((t) => ({ ...t, [data.username]: false })), 5000);
                }
            }
        };

        socket.onclose = () => {
            setConnected(false);
        };

        socket.onerror = (e) => {
            console.error("WS error", e);
        };

        return () => {
            // cleanup - do not close here; app may still run
        };
    }, [username, currentRoom]);

    // helper send message wrapper
    function send(obj) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(obj));
        }
    }

    function handleCreateRoom(roomName) {
        send({ type: "create_room", room: roomName });
        send({ type: "join_room", room: roomName });
        setCurrentRoom(roomName);
        setMessages([]);
    }

    function handleJoinRoom(roomName) {
        send({ type: "join_room", room: roomName });
        setCurrentRoom(roomName);
        setMessages([]);
    }

    function handleSendMessage(text) {
        if (dmTarget) {
            // DM mode
            send({ type: "dm", to: dmTarget, text });
            setMessages((m) => [...m, { from: username, text, dm: true }]);
        } else {
            send({ type: "message", room: currentRoom, text });
            // optionally push locally (server will broadcast back)
        }
    }

    function handleTyping(isTyping) {
        send({ type: "typing", room: currentRoom, isTyping });
    }

    return (
        <div className={darkPref.current ? "app dark" : "app"}>
            <div className="sidebar">
                <div className="userHeader">
                    <div>Signed in as <strong>{username}</strong></div>
                    <button onClick={() => { darkPref.current = !darkPref.current; setTimeout(()=>{},0); document.body.classList.toggle('dark'); }}>Toggle Dark</button>
                </div>

                <RoomsList rooms={rooms} current={currentRoom} onJoin={handleJoinRoom} onCreate={handleCreateRoom} />
                <UsersList users={users} onStartDM={(u)=>setDmTarget(u)} />
            </div>

            <div className="main">
                <h3>{ dmTarget ? `DM with ${dmTarget}` : `Room: ${currentRoom}` }</h3>
                <MessageList messages={messages} typingMap={typingMap} />
                <MessageInput onSend={handleSendMessage} onTyping={handleTyping} />
            </div>
        </div>
    );
}
