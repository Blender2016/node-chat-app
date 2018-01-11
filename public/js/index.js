var socket = io();

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
    // console.log("newMessage" ,message);
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
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
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank"> My current Location </a>');
    // li.text(`${location.from} ${formattedTime}: `);
    // a.attr('href',location.url);
    // li.append(a);
   
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