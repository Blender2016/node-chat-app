const express = require ("express");
const path = require ("path");
const socketIO  = require("socket.io");
const http = require("http");
const {generateMessage ,generateLocationMessage} = require('./utils/message');


// constant variables
const publicPath = path.join(__dirname ,'../public');
const app = express();


const server = http.createServer(app);
const io = socketIO(server);
io.on('connection',(socket)=>{
     console.log("new user connected to the server.");
     
     // send a welcome message from the admin to all connected clients
     socket.emit('newMessage',generateMessage('admin','welcome to the chat app')); 

     socket.broadcast.emit('newMessage',generateMessage('admin',"new user joind"));

     socket.on('disconnect',()=>{
         console.log("user disconnected from the server");
     });

     socket.on("createMessage",(message,callback)=>{
         console.log("createMessage" ,message);
         //broadcast message to all clients
         io.emit('newMessage',generateMessage(message.from,message.text));
         callback();
     });

     socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
     });
});

app.use(express.static(publicPath));

server.listen(3000,()=>{
    console.log("App start listening on port 3000");
});