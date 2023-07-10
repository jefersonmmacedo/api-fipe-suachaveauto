import { Socket } from "socket.io";
import { stringify } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { collections } from "../services/database.service";
import { io } from "./http";

interface Rooms {
  room: string;
  idClient: string;
  idCompany: string;
}

interface RoomUser  {
  socketId: string;
  room: string;
  idClient: string;
  idCompany: string;
}

interface Messages {
  room: string;
  idAccount: string;
  idFriend: string;
  text: string;
  link: string;
  type: string;
  avatar: string;
  name: string;
  created_at: string;
  id: string;
}

const users: RoomUser[] = [];
const messages: Messages[] = [];
const rooms: Rooms[] = [];


io.on("connection", (socket) => {
    console.log(`User Connection ${socket.id}`)
    console.log("Connection successfully established!");

    socket.on("select_room", (data, callback)=> {
      console.log(data)
      socket.join(data.room);
      console.log("Usuário entrou na sala: " + data.room);

      const verifyRooms = rooms.find(room => room.room === data.room);

      if(verifyRooms) {
        console.log("sala ja existe")
      } else {
        rooms.push({
          room: data.room,
          idClient: data.idClient,
          idCompany: data.idCompany
        })
      }



      const userInRoom = users.find(user => user.idClient === data.idClient);

      if(userInRoom) {
        userInRoom.socketId = socket.id
      } else {
        users.push({
          room: data.room,
          idClient: data.idClient,
          idCompany: data.idCompany,
          socketId: socket.id,
        })
      }

        const messagesRoom = findMessages(data.room)
      callback(messagesRoom)

    });

    socket.emit("rooms", rooms);

 
    socket.on("message", (data) => {
      console.log("NOva mensagem WebSocket");
      console.log(data);
      const message: Messages = {
        room: data.room,
        idAccount: data.idAccount,
        idFriend: data.idFriend,
        name: data.name,
        text: data.text,
        link: data.link,
        type: data.type,
        avatar: data.avatar,
        created_at: data.created_at,
        id: data.id
      }

      collections.messagesRooms.insertOne({
        idRoom: data.room,
        idAccount: data.idAccount,
        idFriend: data.idFriend,
        text: data.text,
        link: data.link,
        type: data.type,
        avatar: data.avatar,
        name: data.name,
        created_at: data.created_at,
        id: data.id
      })
      messages.push(message);

      socket.to(data.room).emit("message", message);
    });
      
    socket.on("disconnect", () => {
      console.log("Disconnected user!", socket.id);
    });
  });


  function findMessages(room: string) {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
  }