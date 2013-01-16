var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, {transports:['flashsocket']} )
  , fs = require('fs')

var letterPositions = new Object();
  
app.listen(8888);

io.sockets.on('connection', function (socket) {

	console.log("user connected");
	socket.emit('CONNECT_INIT', letterPositions );
		
	socket.on('disconnect', function() {
		socket.emit('user disconnected');
	});
	
	socket.on('message', function( data ){
		socket.send("mesg ack", data);
	});

	socket.on('LETTER_MOVED', function(data){

		letterPositions[data.char] = new Object();
		letterPositions[data.char].x = data.x;
		letterPositions[data.char].y = data.y;
	
		socket.broadcast.emit('LETTER_MOVED', letterPositions );
	});
  
	socket.on('RESET_LETTERS', function(data){
		letterPositions = new Object();
	});
	
});
