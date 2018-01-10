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
socket.on('newLocationMessage',function(location){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My current Location </a>');
    li.text(`${location.from} : `);
    a.attr('href',location.url);
    li.append(a);
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

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
       return alert("Geolocation doesn't supported by your browser");
    }
    
    navigator.geolocation.getCurrentPosition(function(position){
      socket.emit('createLocationMessage',{
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
      });
    },function(){
       alert('Unable to fetch location.');
    });

});