const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  }, { 
    timestamps: true,
    versionKey: false,
   });
  
module.exports = mongoose.model("Chat", ChatSchema);