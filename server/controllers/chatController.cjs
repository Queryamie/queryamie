// controllers/chatController.js
const ChatSession = require('../models/ChatSession.cjs');
const mongoose = require('mongoose');

exports.startChat = async (req, res) => {
    try {
        const { user_id, message } = req.body;

        if (!user_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const chatSession = new ChatSession({
            user_id: user_id,
            session_name: message,
            messages: [{
                message: message,
                sender: 'user',
                timestamp: new Date()
            }]
        });

        const savedSession = await chatSession.save();
        return res.status(200).json({ status: 'Chat session started', session_id: savedSession._id });
    } catch (error) {
        console.error("Error starting chat:", error);
        return res.status(500).json({ error: 'Failed to start chat session' });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { user_id, message, sender } = req.body;
        const { session_id } = req.params;

        if (!user_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const newMessage = {
            message: message,
            sender: sender,
            timestamp: new Date()
        };

        await ChatSession.updateOne(
            { _id: session_id, user_id: user_id },
            { $push: { messages: newMessage } }
        );

        return res.status(200).json({ status: 'Message added to chat session' });
    } catch (error) {
        console.error("Error adding message:", error);
        return res.status(500).json({ error: 'Failed to add message to chat session' });
    }
};

exports.getChatSessions = async (req, res) => {
    try {
        const user_id = req.query.user_id;

        if (!user_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const sessions = await ChatSession.find({ user_id: user_id }).sort({ created_at: -1 });

        const sessionList = sessions.map(session => ({
            session_id: session._id,
            session_name: session.session_name,
            created_at: session.created_at.toISOString()
        }));

        return res.status(200).json({ chat_sessions: sessionList });
    } catch (error) {
        console.error("Error fetching chat sessions:", error);
        return res.status(500).json({ error: 'Failed to retrieve chat sessions' });
    }
};

exports.getSessionMessages = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const session = await ChatSession.findOne({ _id: session_id, user_id: user_id });

        if (!session) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        const messages = session.messages.map(message => ({
            message: message.message,
            sender: message.sender,
            timestamp: message.timestamp.toISOString()
        }));

        return res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching session messages:", error);
        return res.status(500).json({ error: 'Failed to retrieve session messages' });
    }
};

exports.deleteChatSession = async (req, res) => {
    try {
        const { session_id } = req.params;
        const user_id = req.query.user_id;

        if (!user_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const chatSession = await ChatSession.findOne({ _id: session_id, user_id: user_id });

        if (!chatSession) {
            return res.status(404).json({ error: 'Chat session not found or not authorized' });
        }

        await ChatSession.deleteOne({ _id: session_id, user_id: user_id });

        return res.status(200).json({ status: 'Chat session deleted successfully' });
    } catch (error) {
        console.error("Error deleting chat session:", error);
        return res.status(500).json({ error: 'Failed to delete chat session' });
    }
};
