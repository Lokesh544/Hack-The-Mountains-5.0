import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import userRouter from "./router/userRouter.js";
import chatbotRouter from "./router/chatbotRouter.js";

const port = 3000;
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const db = await mongoose.connect(process.env.MONGODB_URI || "").then((db) => {
  console.log("DataBase Connected");
  return db;
});

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/user", userRouter);
app.use("/chat", chatbotRouter);

io.on("connection", (socket) => {
  socket.on("teir_1", (arg) => {
    if (!arg.text) return;
    io.emit("teir_1", { username: arg.user.username, msg: arg.text });
  });
});

httpServer.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
