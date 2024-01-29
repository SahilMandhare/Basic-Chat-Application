import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(express.json());

const Port = 4000;

const server = app.listen(Port, () => {
  console.log("Successfully Port");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // socket.on("connect", () => console.log("connect : " + socket.id));
  console.log("connect : " + socket.id);
  socket.on("NewMessage", (NewMessage) => {
    console.log(NewMessage);
    socket.broadcast.emit("Data", NewMessage);
  });
  socket.on("disconnect", () => {
    console.log("disconnect : " + socket.id);
  });
});