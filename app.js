var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.send('Hey there');
    console.log('GET');
});

app.post('/', function(req, res) {
    res.send('Thanks');
    console.log(req.body);
    console.log('POST');
});

var server = app.listen(11100, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
