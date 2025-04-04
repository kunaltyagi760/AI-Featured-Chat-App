const express = require("express");
const authMiddleware = require("../middleware/authn");
const router = express.Router();
const Message = require("../models/MessageModel");
const Chats = require("../models/ChatModel");

router.post("/", authMiddleware, async (req, res) => {
    try {
      const { chatId, receiverId, message } = req.body;
      const newMessage = new Message({ chat: chatId, sender: req.user.id, receiver: receiverId, message });
      await Chats.findByIdAndUpdate(chatId,{ latestMessage: newMessage }, { new: true });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get("/:chatId", authMiddleware, async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chat: chatId }).select("-chat -_id -timestamp -updatedAt");

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;