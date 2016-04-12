var fs = require('fs');
var EventEmitter = require('events');

var emitter = new EventEmitter();

var files = [];
// var subjects = [];

emitter.once('combineData',function(subjects){
	var output = [];
	for(var subnum = 0; subnum < subjects.length; subnum++){
		var subject = subjects[subnum];
		var aggData = {};

		//Delete points over 10000 msec
		for(var i = 0; i < subject.length; i++){
			var data = subject[i].data;
			var newData = [];
			for(var j = 0; j < data.length; j++){
				if(parseInt(data[j].rt) < 10000){
					newData.push(data[j]);
				}
			}
			subject[i].data = newData;
		}
		//Delete participants with more than 10% response under 300ms
		var speedCount = 0;
		var dataCount = 0;
		for(var i = 0; i < subject.length; i++){
			var data = subject[i].data;
			for(var j = 0; j < data.length; j++){
				dataCount++;
				if(parseInt(data[j].rt) < 300){
					speedCount++;
				}
			}
		}
		//Add 600ms to scores with error
		for(var i = 0; i < subject.length; i++){
			var data = subject[i].data;
			var newData = [];
			for(var j = 0; j < data.length; j++){
				if(data[j].acc == 0){
					data[j].rt = parseInt(data[j].rt) + 600;
					newData.push(data[j]);
				} else {
					newData.push(data[j]);
				}
			}
			subject[i].data = newData;
		}
		if((speedCount / dataCount) < .1){
			//Compute mean latency for responses in 3,5
			//Compute the inclusive standard deviation for all trials in stage 3 and 5
			var mean3 = 0;
			var mean5 = 0;
			var incsd = 0;

			var data3;
			var data5;

			for(var i = 0; i < subject.length; i++){
				if(subject[i].phase == 3){
					data3 = subject[i].data;
				} else if(subject[i].phase == 5){
					data5 = subject[i].data;
				}
			}

			for(var i = 0; i < data3.length; i++){
				mean3 += parseInt(data3[i].rt);
			}
			for(var i = 0; i < data5.length; i++){
				mean5 += parseInt(data5[i].rt);
			}
			mean3 = mean3 / data3.length;
			mean5 = mean5 / data5.length;

			//Compute mean difference (mean5 - mean3)
			var meandif = mean5 - mean3;

			var squaredif = 0;
			var combdata = data3.concat(data5);
			var combmean = 0;

			for(var i = 0; i < combdata.length; i++){
				combmean += parseInt(combdata[i].rt)
			}
			combmean = combmean / combdata.length;

			for(var i = 0; i < combdata.length; i++){
				squaredif += Math.pow(combmean - parseInt(combdata[i].rt), 2);
			}

			incsd = Math.sqrt(squaredif / (combdata.length - 1));
			//D = difference score / inclusive SD
			var D = meandif / incsd;

			//Calculate mean response time among all 5 trials
			var meanResponse = 0;
			var totalLength = 0;
			for(var i = 0; i < subject.length; i++){
				var data = subject[i].data;
				for(var j = 0; j < data.length; j++){
					meanResponse += parseInt(data[j].rt);
					totalLength++;
				}
			}
			meanResponse = meanResponse / totalLength;

			aggData.meanResponse = meanResponse;
			aggData.meanDif = meandif;
			aggData.SD = incsd;
			aggData.D = D;
			aggData.ip = subject[0].ip;
			aggData.timestamp = subject[0].time;
			output.push(aggData);
		}
	};
	console.log(JSON.stringify(output));
});

emitter.on('checkData', function(data){
	var subjects = [];
	for(var i = 0; i < data.length; i++){
		var dataPoint = data[i];
		if(dataPoint.length < 5){
			// console.log("short");
		} else if(dataPoint.length > 5){
			// console.log("long")
		} else {
			subjects.push(dataPoint);
		}
		// console.log(dataPoint);
	}
	// console.log(subjects.length)
	emitter.emit('combineData', subjects);

})

function getMax(arr){
	var max = 0;
	for(var i = 0; i < arr.length; i++){
		if(arr[i] > max)
			max = arr[i];
	}
	return max;
}

emitter.on('readFile', function(inFile){
	var subjects = [];
	files.push(inFile);
	if(files.length === 5){
		var numParticipants = 0;
		var temp = [];
		for(var i = 0; i < files.length; i++){
			temp.push(files[i].length);
		}
		numParticipants = getMax(temp);
		// console.log(numParticipants)
		// console.log(files);
		files[0].forEach(function(subject){
			var ip = subject.ip;
			// console.log(ip);
			var subjectAll = [];
			for(var i = 0; i < files.length; i++){
				var file = files[i];
				file.forEach(function(dataPoint){
					if(dataPoint.ip === ip){
						subjectAll.push(dataPoint);
					}
				});
			};
			subjects.push(subjectAll);
			if(subjects.length === files[0].length){ 
				// console.log(subjects);
				emitter.emit('checkData', subjects);
			}
		});
	}
});


for(var i = 1; i <= 5; i++){
	fs.readFile('data/data'+i+'.json', function(err, file){
		emitter.emit('readFile', JSON.parse(file));
	});
};