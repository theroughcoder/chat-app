import express from "express";

import Chat from "../models/chatModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";

const router = express.Router();

router.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const chatBody = {
      chats: [
        {
          msg: req.body.msg,
          name: req.body.name,
        },
      ],
    };

    const [chats] = await Chat.insertMany(chatBody);

    res.send(chats);
  })
);
router.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userChats = await Chat.findById(req.params.id);
    userChats.chats.push({ msg: req.body.msg, name: req.body.name });
    userChats.save();
    res.send({message: "chat added"});
  })
); 
router.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userChats = await Chat.findById(req.params.id);
    res.send(userChats.chats);
  })
);
export default router;
