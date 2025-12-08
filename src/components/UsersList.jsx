export default function UsersList({ users, onStartDM }) {
    return (
        <div className="panel">
            <h4>Online</h4>
            <ul className="users">
                {users.map(u => <li key={u.username}><button onClick={()=>onStartDM(u.username)}>{u.username} <small>({u.room||'-'})</small></button></li>)}
            </ul>
        </div>
    );
}
