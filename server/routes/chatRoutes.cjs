// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.cjs');

// Define routes
router.post('/start-chat', chatController.startChat);
router.post('/add-message/:session_id', chatController.addMessage);
router.get('/get-chat-sessions', chatController.getChatSessions);
router.post('/get-session-messages/:session_id', chatController.getSessionMessages);
router.delete('/delete-chat-session/:session_id', chatController.deleteChatSession);

module.exports = router;
