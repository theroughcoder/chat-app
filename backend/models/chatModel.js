import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  firstChat: {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  },
  secondChat: {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  },
  chats: [
    {
      msg: { type: String },
      name: { type: String, required: true },
    }
  ], 
},{
  timestamps: true
});
const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
