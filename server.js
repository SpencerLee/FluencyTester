var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 3000;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));


io.on('connection', function(socket) {
	console.log(socket.id + ' connected');


	socket.on('disconnet', function(){
		console.log(socket.id + ' disconnected');
	})
})


socket.on('submitAnswer', funciton(ans) {
	console.log("Answer: " + ans);
	
})


http.listen(port, function(){
	console.log('listening on ' + port);
});