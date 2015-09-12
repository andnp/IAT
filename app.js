var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var moment = require('moment');
var sys = require('sys');
var exec = require('child_process').exec;
var app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res, next) {

    fs.readFile('data/data1.json', function(err,data){

    });

    res.send('Hey there');
    console.log('GET');
});

app.post('/', function(req, res, next) {
    res.send('Thanks');
    var ip = req.ip;
    var data = req.body;
    data.ip = ip;
    data.time = moment().format('YYYY-MM-DD HH:mm:ss Z');

    fs.readFile('data/data'+data.phase+'.json', function(err, file){
        var json = JSON.parse(file);
        console.log(json);
        json.push(data);
        fs.writeFile('data/data'+data.phase+'.json', JSON.stringify(json),function(err){
            if(err) console.log(err);
        });
    });
    
    if(data.phase == 5) {
	console.log('running git script');
	exec('./gitscript.sh', function(error, stdout, stderr){
	    sys.print('stdout: ' + stdout);
	    sys.print('stderr: ' + stderr);
	    if(error){ console.log('exec error: ' + error); }
	});
    }

    console.log(req.ip);
    console.log(req.body);
    console.log('POST');
});

var server = app.listen(11100, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
