const express = require ("express");
const path = require ("path");
const socketIO  = require("socket.io");
const http = require("http");

// constant variables
const publicPath = path.join(__dirname ,'../public');
const app = express();


const server = http.createServer(app);
const io = socketIO(server);
io.on('connection',(socket)=>{
     console.log("new user connected to the server.");
     
     // send a welcome message from the admin to all connected clients
     socket.emit('welcomeMessage',{
         from:'admin',
         text:'welcome to the chat app'
     }); 

     socket.broadcast.emit('newUserJoind',{
         from:'admin',
         text:"new user joind",
         createdAt:new Date().getTime()
     });

     socket.on('disconnect',()=>{
         console.log("user disconnected from the server");
     });

    //  socket.on('createEmail',(newEmail)=>{
    //     console.log('createEmail ', newEmail);
    //  });

    //  socket.emit('newEmail',{
    //      from : 'test@test.com',
    //      text : 'hello world',
    //      createdAt: '1234'
    //  });

     socket.on("createMessage",(newMessage)=>{
         console.log("createMessage" ,newMessage);
          
         

         //broadcast message to all clients
         io.emit('newMessage',{
             from:newMessage.from,
             text:newMessage.text,
             createdAt:new Date().getTime
         });
        //--------------------------------- 
        // broadcast message to all clients except the client that dispatch the event
        // socket.broadcast.emit('newMessage',{
        //    from:newMessage.from,
        //    text:newMessage.text,
        //    createdAt:new Date().getTime()
        // });
     });

    //  socket.emit('newMessage',{
    //      from :'ali',
    //      text: 'hello everyone',
    //      createdAt:12165
    //  });


});



//builtin middlewares
app.use(express.static(publicPath));

// app.get('/',(req,res)=>{
//     res.sendFile('/index.html');
// });


server.listen(3000,()=>{
    console.log("App start listening on port 3000");
});