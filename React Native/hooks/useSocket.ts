import { io } from "socket.io-client";

const port = 3000;
export const socket = io(`http://localhost:${port}`);
