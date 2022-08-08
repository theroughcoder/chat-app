import express from "express";

import Chat from "../models/chatModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";

const router = express.Router();


router.get(
  "/friends/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const friends = await Chat.find({ $or: [ { 'firstChat.id' : req.params.id }, { 'secondChat.id': req.params.id } ] }).sort({updatedAt: -1});

    res.send(friends);
  })
);

router.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const chatBody = {
      firstChat: {
        id : req.body.firstChatId,
      },
      secondChat: {
        id : req.body.secondChatId,
      },
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
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userChats = await Chat.findById(req.body.chatId);
    userChats.chats.push({ msg: req.body.msg, name: req.body.name });
    userChats.save();
    res.send({message: "chat added"});

  })
); 
router.get(
  "/:id/:fid",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userChats = await Chat.findOne({
      'firstChat.id': { $in: [req.params.id, req.params.fid]},
      'secondChat.id': { $in: [req.params.id, req.params.fid]} 
    })
      

    res.send(userChats);
  })
);
export default router;
