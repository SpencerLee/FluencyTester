var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var math = require('mathjs');

var port = 3000;



var currentQuestion = '';

// fluency variables
var fluency = 1;
var totalQuestions = 0
var numCorrect = 0;

var askTime;
var answerTime;

// question block variables
var currentBlock = [];
var currentBlockIndex = 0;
var blockSize = 5;

// Serve our index.html page at the root url
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Have express serve all of our files in the public directory
app.use(express.static('public'));

// Code in this block is run every time a new socketIO connection is made
io.on('connection', function (socket) {
  // socket.id is a unique id for each socket connection
  console.log(socket.id + ' connected');
  getNextQuestion(true);

  // The following two declarations create handlers for
  // socket events on this specific connection

  // You can do something when the connection disconnects
  socket.on('disconnect', function(){
    console.log(socket.id + ' disconnected');
  });

  // message is our custom event, emit the message to everyone
  socket.on('submitAnswer', function(ans) {
    //console.log("Message: " + ans);

	var isANumber = isNaN(ans) === false;
	if(!isANumber){
		//console.log('answer was not a number');
		io.emit('user-answer', 'You entered ' + ans + ' . Please enter only numbers in your answer');
	}
	else{
		correctAns = math.eval(currentQuestion);
		if(correctAns == math.eval(ans)){
			io.emit('user-answer', 'your answer of ' + ans + ' was correct!');
			//console.log('correct answer')
		}
		else{
			io.emit('user-answer', 'your answer of ' + ans + ' was incorrect');
			//console.log('incorrect answer')
		}
    	getNextQuestion(false);
	}
  });
});

// Starts the web server at the given port
http.listen(port, function(){
  console.log('Listening on ' + port);
  
});

var generateQuestion = function(difficulty){
	var question = ''; // a 'blank' question
	var term1 = random1to10(); // the first term of the expression will be a random number from 1 to 10
	var term2 = random1to10(); // the second term of the expression will be a random number from 1 to 10
	var randOp = Math.floor((Math.random()*100)+1)
	
	//if random operator is >= 50 operation is addition otherwise subtraction
	var op;
	if(randOp >=50){
		op = ' + '
	}
	else{
		op = ' - '
	}
	// put together all of the elements of the question into a single string
	question = question.concat(term1.toString());
	question = question.concat(op);
	question = question.concat(term2.toString());
	console.log('new question: ' + question);
	return question;
};



// calculates new fluency after each question
var updateFluency = function(){

}

// generates a new block of questions based on given difficulty and block size
var generateNewBlock = function(difficulty){
	var block = []
	for(i=0; i<blockSize; i++){
		block.push(generateQuestion(difficulty));
	}
	return block;
}

// helper function: generates a number between 1 and 10
var random1to10 = function(){
	return Math.floor((Math.random()*10)+1) ;
};

//sets the next question in a block to be the current question. if there is no next question calculate new difficulty and create a new block
var getNextQuestion = function(shouldRestart){
	currentBlockIndex++
	if((typeof currentBlock[currentBlockIndex] === 'undefined') || shouldRestart){
		difficulty = calculateDifficulty();
		console.log('generating new block');
		currentBlock = generateNewBlock(difficulty);
		currentBlockIndex = 0;
	}
	currentQuestion = currentBlock[currentBlockIndex];
	io.emit('new-question', currentQuestion);
}

// helper function: calculates the difficulty based on current fluency score
var calculateDifficulty = function(){
	return 0;
}