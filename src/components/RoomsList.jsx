import { useState } from "react";

export default function RoomsList({ rooms, current, onJoin, onCreate }) {
    const [roomName, setRoomName] = useState("");
    return (
        <div className="panel">
            <h4>Rooms</h4>
            <ul className="rooms">
                {rooms.map(r => <li key={r} className={r===current?'active':''}><button onClick={()=>onJoin(r)}>{r}</button></li>)}
            </ul>
            <div style={{marginTop:8}}>
                <input placeholder="New room" value={roomName} onChange={(e)=>setRoomName(e.target.value)} />
                <button onClick={()=>{ if(roomName.trim()) { onCreate(roomName.trim()); setRoomName(''); }}}>Create</button>
            </div>
        </div>
    )
}
