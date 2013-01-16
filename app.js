var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, {transports:['flashsocket']} )
  , fs = require('fs')


var letterPositions = new Object();
  
app.listen(8888);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}



io.sockets.on('connection', function (socket) {

	//io.sockets.emit('this', { will: 'be received by everyone'});
	
	console.log("user connected");
	socket.emit('CONNECT_INIT', letterPositions );
		
	socket.on('disconnect', function() {
		socket.emit('user disconnected');
	});
	
	socket.on('message', function( data ){
		socket.send("mesg ack", data);
	});

	socket.on('LETTER_MOVED', function(data){

		console.log(data);
		
		letterPositions[data.char] = new Object();
		letterPositions[data.char].x = data.x;
		letterPositions[data.char].y = data.y;
	
		console.log(letterPositions);
		
		socket.broadcast.emit('LETTER_MOVED', letterPositions );
	});
  
	socket.on('RESET_LETTERS', function(data){
		
		console.log("RESET");
		letterPositions = new Object();
	});
	
});