var express = require('express');
var bodyParser = require('body-parser');
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
    res.send('Hey there');
    console.log('GET');
});

app.post('/', function(req, res, next) {
    res.send('Thanks');
    console.log(req.ip);
    console.log(req.body);
    console.log('POST');
});

var server = app.listen(11100, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
