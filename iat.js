var TRIALS = 10;
var left_array = ["L", "Left", "left", "LEFT"];
var right_array = ["R", "Right", "right", "RIGHT"];

var start_time = 0;
var reaction_time = 0;
var counter = 0;

var side = 0; // 0 means left, 1 means right
var word_index = 0; // index of word
var waiting_for_input = 0;
var word;

var data = [];
function iat(){
	counter++;
	side = Math.round((Math.random() * 1));
	word_index = randBetween(0, left_array.length);;
	if(side == 0){
		word = left_array[word_index];
	} else {
		word = right_array[word_index];
	}
	waiting_for_input = 1;
	release = 0;
	start_time = Date.now();
	document.getElementById("word").innerHTML = word;
}

function correct(picked_side){
	if(picked_side == side){
		return 1;
	} else {
		return 0;
	}
}

function randBetween(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
}

window.onkeydown = function(e){
	console.log(waiting_for_input);
	if(waiting_for_input == 0) return;
	var code = e.keyCode ? e.keyCode : e.which;
	if(code == 70){
		evaluate(0);
	} else if(code == 74){
		evaluate(1);
	}
}

function evaluate(picked){
	reaction_time = Date.now() - start_time;
	new_point = {acc:correct(picked), rt:reaction_time, word:word};
	data.push(new_point);
	document.getElementById("word").innerHTML = "";
	waiting_for_input = 0;
	if(counter < TRIALS){
		setTimeout(iat, randBetween(750, 2000));
	} else {
		alert("data to be sent to server:\n" + JSON.stringify(data));
	}
}