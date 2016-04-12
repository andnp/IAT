var fs = require('fs');
var EventEmitter = require('events');

var emitter = new EventEmitter();

var allData = []
emitter.on('readFiles', function(data){
	allData.push(data);
	if(allData.length == 2){
		var json;
		var csv;
		if(allData[0].json){
			json = allData[0].json;
			csv = allData[1].csv;
		} else {
			json = allData[1].json;
			csv = allData[0].csv;
		}
		var matches = 0;
		for(var j = 0; j < csv.length; j++){
			var ip = csv[j][6];
			// console.log(ip)
			var low = new Date(csv[j][4]).getTime();
			var high = new Date(csv[j][5]).getTime();
			var avg = (low + high) / 2;
			// var matches = 0;
			for(var i = 0; i < json.length; i++){
				var dp = json[i];
				var time = new Date(dp.timestamp).getTime();
				// console.log(time);
				// if((time > avg - 30 * 60 * 1000 && time < avg + 30 * 60 * 1000) || dp.ip == ip){
				// 	matches++;
				// }
				if(dp.ip == ip){
					matches++;
				}
			}
			console.log(matches);
		}
	}
})

emitter.on('readCsvFile', function(data){
	var lines = data.split("\n");
	var all = [];
	for(var i = 1; i < lines.length; i++){
		lines[i] = lines[i].replace(new RegExp("\"", 'g'), "");
		var lineData = lines[i].split(",");
		if(lineData[4]){
			var day = lineData[4].split("-")[0]
			var month = lineData[4].split("-")[1]
			var rest = lineData[4].split("-")[2]
			lineData[4] = month + "-" + day + "-" + rest;
			lineData[4] += " -04:00";
		}
		if(lineData[5]){
			var day = lineData[5].split("-")[0]
			var month = lineData[5].split("-")[1]
			var rest = lineData[5].split("-")[2]
			lineData[5] = month + "-" + day + "-" + rest;
			lineData[5] += " -04:00";
		}
		all.push(lineData);
	}
	emitter.emit('readFiles', {csv: all});
});

emitter.on('readJsonFile', function(data){
	emitter.emit('readFiles', {json: data});
});

fs.readFile('aggData/aggData2.json', function(err, file){
	emitter.emit('readJsonFile', JSON.parse(file));
});

fs.readFile('survey.csv', 'utf8', function(err, file){
	emitter.emit('readCsvFile', file);
});