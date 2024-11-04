// models/ChatSession.js
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    session_name: { type: String, required: true },
    messages: [{
        message: { type: String, required: true },
        sender: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
