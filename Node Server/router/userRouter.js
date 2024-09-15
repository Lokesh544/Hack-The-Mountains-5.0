import express from "express";
import { TryCatch } from "../utils/TryCatch.js";
import User from "../db/models/user.js";

const userRouter = express.Router();

userRouter.get(
  "/login",
  TryCatch(async (req, res) => {
    const { username, password } = req.query;

    const user = await User.findOne({
      username: username,
    });
    if (user == null) throw Error("User Not Found");
    if (user.password != password) throw Error("Wrong Password");

    res.json({ user });
  })
);

userRouter.get(
  "/signup",
  TryCatch(async (req, res) => {
    const { username, password } = req.query;

    if (!username || !password)
      throw Error("Username or Password not Provided");
    let user = await User.findOne({
      username: username,
    });
    if (user != null) throw Error("User Allready Exists");
    user = new User({
      username: username.toLowerCase(),
      password,
      role: "public",
    });

    await user.save();
    res.json({ user });
  })
);

export default userRouter;
