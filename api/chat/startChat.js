import ChatSession from "../models/ChatSession.cjs";
// import mongoose from "mongoose";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user_id, message } = req.body;

        if (!user_id) {
        return res.status(401).json({ error: "User not authenticated" });
        }

        try {
        const chatSession = new ChatSession({
            user_id,
            session_name: message,
            messages: [
            {
                message,
                sender: "user",
                timestamp: new Date(),
            },
            ],
        });

        const savedSession = await chatSession.save();
        res.status(200).json({ status: "Chat session started", session_id: savedSession._id });
        } catch (error) {
        console.error("Error starting chat:", error);
        res.status(500).json({ error: "Failed to start chat session" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
