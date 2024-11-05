import ChatSession from "../models/ChatSession.cjs";
import connectDB from '../config/db.cjs';


export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        const { user_id, message, sender } = req.body;
        const { session_id } = req.query;

        if (!user_id) {
        return res.status(401).json({ error: "User not authenticated" });
        }

        try {
        const newMessage = {
            message,
            sender,
            timestamp: new Date(),
        };

        await ChatSession.updateOne(
            { _id: session_id, user_id },
            { $push: { messages: newMessage } }
        );

        res.status(200).json({ status: "Message added to chat session" });
        } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: "Failed to add message to chat session" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
