const Chat = require("../models/ChatModel");
const express = require("express");
const authMiddleware = require("../middleware/authn");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        const existingChat = await Chat.findOne({ participants: { $all: [req.user.id, userId] } });

        if (existingChat) return res.status(200).json({ chatId: existingChat._id });

        const chat = new Chat({ participants: [req.user.id, userId], latestMessage: null });
        await chat.save();

        res.status(201).json({ chatId: chat._id });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/:chatId", authMiddleware, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate("participants", "name profileImage");
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/", authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user.id })
            .populate({
                path: "participants",
                select: "name profileImage", // Select only required fields
            })
            .populate({
                path: "latestMessage",
                select: "message", // Select only the message field
            })
            .select("_id participants latestMessage") // Select only necessary fields
            .lean();

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;