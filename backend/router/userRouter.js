import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const router = express.Router();

router.get(
  "/",

  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

router.get(
  "/search",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const friend = query.friend || "";

    const friendFilter = {
      name: {
        $regex: friend,
        $options: "i",
      },
    };
    const users = await User.find(friendFilter, { name: 1, email: 1, _id: 1 });
    if (users) {
      res.send(users);
    } else {
      res.status(404).send({ message: "Friend not found" });
    }
  })
);

router.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);
router.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    if (req.body.password == req.body.confirmPassword) {
      const Eexist = User.find({ email: req.body.email });

      const userInfo = {
        name: req.body.name,
        email: req.body.email,
        isAdmin: false,
        password: bcrypt.hashSync(req.body.password),
        friends: [],
      };
      const [user] = await User.insertMany(userInfo);

      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
    res
      .status(401)
      .send({ message: "Password and confirm password didn" + "t match" });
  })
);
router.put(
  "/profileupdate",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.password == req.body.cpassword) {
      const userInfo = {
        name: req.body.name,
        email: req.body.email,
        isAdmin: false,
        password: bcrypt.hashSync(req.body.password),
      };
      await User.updateOne({ _id: req.user._id }, userInfo);
      const user = await User.findOne({ _id: req.user._id });

      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
    res
      .status(401)
      .send({
        message: "Password and confirm password didn" + "'" + "t match",
      });
  })
)

export default router;
