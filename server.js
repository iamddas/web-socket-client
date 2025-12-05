import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

function broadcast(data, except) {
    for (const client of wss.clients) {
        if (client !== except && client.readyState === 1) {
            client.send(data);
        }
    }
}

wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "notification", message: "Welcome!" }));

    ws.on("message", (raw) => {
        let payload;
        try {
            payload = JSON.parse(raw.toString());
        } catch {
            payload = { type: "message", username: "Unknown", message: raw.toString() };
        }

        const data = JSON.stringify(payload);
        // Echo to sender
        if (ws.readyState === 1) ws.send(data);
        // Broadcast to others
        broadcast(data, ws);
    });
});

console.log("WebSocket server listening on ws://localhost:8080");