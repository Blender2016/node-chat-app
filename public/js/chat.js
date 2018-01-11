var socket = io();

function scrollToButtom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
       console.log('Should scroll');
       messages.scrollTop(scrollHeight);
    }  
}

socket.on('connect',function () {
    console.log('Connected to the server');
});

socket.on('disconnect',function (){
    console.log("user has disconnected from the server");
});

socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToButtom();
});
socket.on('newLocationMessage',function(location){
    var formattedTime = moment(location.createdAt).format('h:mm a');
    var template = jQuery('#message-location-template').html();
    var html = Mustache.render(template,{
        from:location.from,
        url:location.url,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToButtom();
   
});

//jQuery
jQuery('#message-form').on('submit',function(e){
     e.preventDefault(); //prevent the default behavior of the event .
     
     var messageTextBox = jQuery('[name=message]');
     socket.emit('createMessage',{
         from:'User',
         text:messageTextBox.val()
     },function(){
        messageTextBox.val('');
     });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
       return alert("Geolocation doesn't supported by your browser");
    }

    locationButton.attr('disabled','disabled').text('Sending location .... ');
    
    navigator.geolocation.getCurrentPosition(function(position){
     locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage',{
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
      });
    },function(){
       locationButton.removeAttr('disabled').text('Send location');
       alert('Unable to fetch location.');
    });

});