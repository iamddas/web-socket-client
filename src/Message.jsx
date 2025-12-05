export default function Message({ data }) {
    if (data.type === "notification") {
        return <div style={styles.notification}>{data.message}</div>;
    }

    let text = data?.message;
    // If the message is a JSON string, try to extract a readable text
    if (typeof text === "string") {
        try {
            const parsed = JSON.parse(text);
            // Common shapes: { message: "..." } or { text: "..." }
            if (typeof parsed?.message === "string") text = parsed.message;
            else if (typeof parsed?.text === "string") text = parsed.text;
            // else keep original string
        } catch {
            // not JSON; keep as-is
        }
    }

    return (
        <div style={styles.message}>
            <strong>{data.username}: </strong>
            {text}
        </div>
    );
}

const styles = {
    message: {
        padding: "5px 0",
    },
    notification: {
        color: "gray",
        fontStyle: "italic",
        margin: "5px 0",
    },
};
