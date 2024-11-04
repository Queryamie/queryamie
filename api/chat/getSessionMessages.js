import ChatSession from "../models/ChatSession.cjs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { session_id } = req.query;
        const { user_id } = req.body;

        if (!user_id) {
        return res.status(401).json({ error: "User not authenticated" });
        }

        try {
        const session = await ChatSession.findOne({ _id: session_id, user_id });

        if (!session) {
            return res.status(404).json({ error: "Chat session not found" });
        }

        const messages = session.messages.map((message) => ({
            message: message.message,
            sender: message.sender,
            timestamp: message.timestamp.toISOString(),
        }));

        res.status(200).json({ messages });
        } catch (error) {
        console.error("Error fetching session messages:", error);
        res.status(500).json({ error: "Failed to retrieve session messages" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
