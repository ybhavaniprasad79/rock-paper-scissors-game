import { io } from "socket.io-client";
const socket = io("https://rock-paper-scissors-game-cpee.onrender.com", { transports: ["websocket"] });
export default socket;
