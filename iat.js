// User variables
//---------------------------------------------------------------
var TRIALS = 10; // number of trials
var left_array = ["L", "Left", "left", "LEFT"]; // word list 1
var right_array = ["R", "Right", "right", "RIGHT"]; // word list 2
//---------------------------------------------------------------

// Global constants
var LEFT = 0;
var RIGHT = 1;

// Global variables
var start_time = 0; // set a place holder for when word starts
var reaction_time = 0; // time at end of word - time at beginning
var counter = 0; // number of iterations of iat function

var side = 0; // 0 means left, 1 means right
var waiting_for_input = 0; // flag notifying the key listener we are looking for input
var word; // string holder for word

var left_list = left_array.slice(0);
var right_list = right_array.slice(0);

var data = []; // array to hold data
function iat(){
	var word_index; // initialize word index variable
	counter++; // count the number of times iat has been called
	
	// pick a side at (semi) random
	side = Math.round((Math.random() * 1)); // pick a side at random (left or right)
	if(left_list.length == 0 && right_list.length > 0){ // if left list is empty
		side = RIGHT; // choose right side
	} else if(left_list.length > 0 && right_list.length == 0){ // if right list is empty
		side = LEFT; // choose left side
	} else if(left_list.length == 0 && right_list.length == 0){ // if both lists are empty
		left_list = left_array.slice(0); // refill the list
		right_list = right_array.slice(0); // refill the list
	}
	
	// pick the word based on side
	if(side == LEFT){ // if left side
		word_index = randBetween(0, left_list.length); // pick a word at random
		word = left_list[word_index]; // set word to be the word at the randomly picked index
		left_list.splice(word_index, 1); 
	} else {
		word_index = randBetween(0, right_list.length); // pick a word at random
		word = right_list[word_index]; // set word to be word at randomly picked index
		right_list.splice(word_index, 1); 
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
	clearScreen(); // clear the screen
	waiting_for_input = 0; // clear the waiting for input flag
	if(counter < TRIALS){ // check if we have completed correct number of trials
		if(correct(picked)){
			setTimeout(iat, randBetween(100, 700)); // call iat function in .75 to 2 seconds
		} else {
			document.getElementById("word").innerHTML = "Incorrect";
			setTimeout(clearScreen, 300);
			setTimeout(iat, randBetween(100, 700) + 300);
		}
	} else {
		alert("data to be sent to server:\n" + JSON.stringify(data)); // show data
		// TODO: use JQUERY to send data to server-side php handler
	}
}

function clearScreen(){
	document.getElementById("word").innerHTML = ""; // clear the screen
}