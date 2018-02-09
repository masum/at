var express = require("express");
var path = require("path");
var app = express();

app.use('/pub', express.static('public'));
app.use('/lib', express.static('bower_components'));


var data = {}
app.get("/api/data", function(req, res, next){
    res.json(data);
});

var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});




