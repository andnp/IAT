var fs = require('fs');
var EventEmitter = require('events');

var emitter = new EventEmitter();

var files = [];
var subjects = [];

emitter.once('combineData',function(){
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
			var length = Math.max(data3.length, data5.length);
			for(var i = 0; i < length; i++){
				if(data3[i] && data5[i]){
					squaredif += Math.pow(meandif + (parseInt(data3[i].rt) - parseInt(data5[i].rt)), 2);
				} else if(!data3[i]){
					squaredif += Math.pow(meandif + (mean3 - parseInt(data5[i].rt)), 2);
				} else if(!data5[i]){
					squaredif += Math.pow(meandif + (parseInt(data3[i].rt) - mean5), 2);
				}
			}

			incsd = Math.sqrt(squaredif / (length - 1));
			//D = difference score / inclusive SD
			var D = meandif / incsd;
			aggData.meanDif = meandif;
			aggData.SD = incsd;
			aggData.D = D;
			aggData.ip = subject[0].ip;
			aggData.timestamp = subject[0].time;
			output.push(aggData);
		}
	};
	console.log(output);
});

emitter.on('readFile', function(inFile){
	files.push(inFile);
	if(files.length === 5){
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
			if(subjects.length === files[0].length) emitter.emit('combineData');
		});
	}
});


for(var i = 1; i <= 5; i++){
	fs.readFile('data/data'+i+'.json', function(err, file){
		emitter.emit('readFile', JSON.parse(file));
	});
};