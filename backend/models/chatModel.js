import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  chats: [
    {
      msg: { type: String, required: true },
      name: { type: String, required: true },
    }
  ],
});
const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
