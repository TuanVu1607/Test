const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    gmail: String,
    messageText: String,
    chatTime: {
      type: Date,
      default: Date.now
    }
  }
)

const ConversationSchema = new mongoose.Schema(
  {
    gmail: String,
    messages: [MessageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversations", ConversationSchema, "Conversations");
