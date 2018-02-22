var express = require("express");
var path = require("path");
var app = express();

app.use('/pub', express.static('pub'));
app.use('/lib', express.static('bower_components'));


var data = {}
app.get("/api/data", (req, res, next) => {
    res.json(data);
});

var server = app.listen(3000, () => {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var http = require('http');
//サーバインスタンス作成
var server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('server connected');
});
var io = require('socket.io').listen(server);

server.listen(8888);//8888番ポートで起動

//接続確立時の処理
io.sockets.on('connection', (socket) => {
    // この中でデータのやり取りを行う
    console.log('connected');
    socket.on('move', function(d){
        // そのまま全接続先へ送信
        console.log(d);
        io.emit('rsvmove', d);
    });
});
