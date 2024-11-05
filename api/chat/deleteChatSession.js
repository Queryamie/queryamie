import ChatSession from "../models/ChatSession.cjs";
import connectDB from '../config/db.cjs';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "DELETE") {
        const { session_id } = req.query;
        const { user_id } = req.body;

        if (!user_id) {
        return res.status(401).json({ error: "User not authenticated" });
        }

        try {
        const chatSession = await ChatSession.findOne({ _id: session_id, user_id });

        if (!chatSession) {
            return res.status(404).json({ error: "Chat session not found or not authorized" });
        }

        await ChatSession.deleteOne({ _id: session_id, user_id });

        res.status(200).json({ status: "Chat session deleted successfully" });
        } catch (error) {
        console.error("Error deleting chat session:", error);
        res.status(500).json({ error: "Failed to delete chat session" });
        }
    } else {
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
