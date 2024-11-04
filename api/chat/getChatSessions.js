import ChatSession from "../models/ChatSession.cjs";
import connectDB from '../config/db.cjs';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        const { user_id } = req.query;

        if (!user_id) {
        return res.status(401).json({ error: "User not authenticated" });
        }

        try {
        const sessions = await ChatSession.find({ user_id }).sort({ created_at: -1 });
        const sessionList = sessions.map((session) => ({
            session_id: session._id,
            session_name: session.session_name,
            created_at: session.created_at.toISOString(),
        }));

        res.status(200).json({ chat_sessions: sessionList });
        } catch (error) {
        console.error("Error fetching chat sessions:", error);
        res.status(500).json({ error: "Failed to retrieve chat sessions" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
