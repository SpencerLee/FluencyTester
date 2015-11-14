var socket = io();

// When the user clicks on send button
$('#answer-click').click(function(){
  sendMessage();

});

// Or the user presses enter from the text box
$('#answer').keydown(function(event) {
  if (event.keyCode == 13) {
    sendMessage();
  }
});



var sendMessage = function() {
  socket.emit('submitAnswer', $('#answer').val());

  $('#answer').val('');
};

socket.on('new-question', function(currentQuestion) {
	$('#question').text(currentQuestion);
	console.log('new question generated');
});
// When we receive a user message, add to html list
socket.on('user-answer', function(ans) {
  var new_ans = $('<li>').text(ans);
  $('#messages').append(new_ans);
  $('body,html').animate({scrollTop: $('#messages li:last-child').offset().top + 5 + 'px'}, 5);
});


