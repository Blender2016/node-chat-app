var socket = io();

socket.on('connect',function () {
    console.log('Connected to the server');
});

socket.on('disconnect',function (){
    console.log("user has disconnected from the server");
});

socket.on('newMessage',function(message){
    console.log("newMessage" ,message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} : ${message.text}`);
    jQuery('#messages').append(li);
});

//jQuery
jQuery('#message-form').on('submit',function(e){
     e.preventDefault(); //prevent the default behavior of the event .

     // when the user submit the form make a socket emitor
     socket.emit('createMessage',{
         from:'User',
         text:jQuery('[name=message]').val()
     },function(){

     });
});