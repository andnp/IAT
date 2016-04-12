var fs = require('fs');

fs.readFile('aggData/aggData2.json', function(err, file){
	var json = JSON.parse(file);
	str = "";
	for(var i = 0; i < json.length; i++){
		var dat = json[i];
		var year = dat.timestamp.split("-")[0];
		var month = dat.timestamp.split("-")[1];
		var day = dat.timestamp.split("-")[2].split(" ")[0];
		var rest = dat.timestamp.split(" ")[1]; // good enough :D
		str += dat.ip + "," + day+"-"+month+"-"+year+" "+rest + "," + dat.meanResponse + "," + dat.meanDif + "," + dat.SD + "," + dat.D + ",\n";
	}
	console.log(str)
});