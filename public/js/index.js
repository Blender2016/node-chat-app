var socket = io();
socket.on('connect',function () {
    console.log('Connected to the server');

    // socket.emit('createEmail' ,{
    //     to :'example@example.com',
    //     text: 'hello server',
    //     createdAt:new Date().getTime()
    // });

    // socket.emit('createMessage',{
    //     from: 'ahmed',
    //     text:'hello samir'
    // });
});
socket.on('disconnect',function (){
    console.log("user has disconnected from the server");
});

// socket.on('newEmail',function(email){
//     console.log("new email",email);
// });

socket.on('newMessage',function(message){
    console.log("newMessage" ,message);
});


