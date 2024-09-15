import express from "express";
import { TryCatch } from "../utils/TryCatch.js";

const chatbotRouter = express.Router();

chatbotRouter.get(
  "/",
  TryCatch(async (req, res) => {
    const { prompt } = req.query;
    const r = await fetch(`${process.env.ChatbotServer}/chat?prompt=${prompt}`)
      .then((res) => res.json())
      .catch((e) => {
        console.log(e);
        return "NAN";
      });

    res.json({
      res: r,
    });
  })
);

export default chatbotRouter;
