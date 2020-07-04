var express = require('express');
console.log("Welcome to the application: Running....");
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

let svg = '';
app.use(express.static('public'));

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('delete', function (msg) {
        //  console.log('message: ' + msg);
        socket.broadcast.emit('delete', msg);
    });

    socket.on('update', function (msg) {
        // console.log('message: ' + msg);
        socket.broadcast.emit('update', msg);
    });
    socket.on('add', function (msg) {
        // console.log('message: ' + msg);
        socket.broadcast.emit('add', msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


// io.on('connection', function (socket) {
//
// });

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


http.listen(8080);
