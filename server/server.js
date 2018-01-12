const express = require ("express");
const path = require ("path");
const socketIO  = require("socket.io");
const http = require("http");
const {generateMessage ,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


// constant variables
const publicPath = path.join(__dirname ,'../public');
const app = express();


var users = new Users();


const server = http.createServer(app);
const io = socketIO(server);
io.on('connection',(socket)=>{
     console.log("new user connected to the server.");

     socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Username and room name are required .');
        }
        socket.join(params.room);
        users.removeUser(socket.id); // remove user from other rooms.
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));


         socket.emit('newMessage',generateMessage('Admin','welcome to the chat app')); 
         socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} joind`));
        callback();
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

     socket.on('disconnect',()=>{
        console.log("user disconnected from the server");
        var user = users.removeUser(socket.id);
        io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    });
});

app.use(express.static(publicPath));

server.listen(3000,()=>{
    console.log("App start listening on port 3000");
});