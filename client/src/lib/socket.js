import { io } from "socket.io-client";
import { getUser } from "./session";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { userId: getUser()?.userId },
    });
  }
  return socket;
}