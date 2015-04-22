// User variables
//---------------------------------------------------------------
var TRIALS = 10; // number of trials
var left_array = ["L", "Left", "left", "LEFT"]; // word list 1
var right_array = ["R", "Right", "right", "RIGHT"]; // word list 2
//---------------------------------------------------------------
// Global constants
var LEFT = 0;
var RIGHT = 1;

var start_time = 0; // set a place holder for when word starts
var reaction_time = 0; // time at end of word - time at beginning
var counter = 0; // number of iterations of iat function

var side = 0; // 0 means left, 1 means right
var word_index = 0; // index of word
var waiting_for_input = 0; // flag notifying the key listener we are looking for input
var word; // string holder for word

var data = []; // array to hold data
function iat(){
	counter++; // count the number of times iat has been called
	side = Math.round((Math.random() * 1)); // pick a side at random (left or right)
	word_index = randBetween(0, left_array.length); // pick a word at random
	if(side == LEFT){ // if left side
		word = left_array[word_index]; // set word to be the word at the randomly picked index
	} else {
		word = right_array[word_index]; // set word to be word at randomly picked index
	}
	waiting_for_input = 1; // set waiting for input flag
	start_time = Date.now(); // get the time this iteration started
	document.getElementById("word").innerHTML = word; // display the word on screen.
}

// Takes the side the user selected and returns 0 for wrong 1 for correct
function correct(picked_side){
	if(picked_side == side){
		return 1;
	} else {
		return 0;
	}
}

// takes a minimum integer and a maximum integer and returns a random number between [min,max)
function randBetween(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
}

// called whenever any key is pressed down.
window.onkeydown = function(e){
	if(waiting_for_input == 0) return; // if we are not waiting for input, bypass function
	var code = e.keyCode ? e.keyCode : e.which; // set code to be the keycode
	if(code == 70){ // if 'f'
		evaluate(LEFT); // evaluate the choice given user picked left
	} else if(code == 74){ // if 'j'
		evaluate(RIGHT); // evaluate the choice given the user picked right
	}
}

function evaluate(picked){
	reaction_time = Date.now() - start_time; // reaction time is current time - starting time
	new_point = {acc:correct(picked), rt:reaction_time, word:word}; // make a data point object
	data.push(new_point); // add that data point to the data list
	document.getElementById("word").innerHTML = ""; // clear the screen
	waiting_for_input = 0; // clear the waiting for input flag
	if(counter < TRIALS){ // check if we have completed correct number of trials
		setTimeout(iat, randBetween(750, 2000)); // call iat function in .75 to 2 seconds
	} else {
		alert("data to be sent to server:\n" + JSON.stringify(data)); // show data
		// TODO: use JQUERY to send data to server-side php handler
	}
}