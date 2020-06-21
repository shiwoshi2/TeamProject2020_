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
    if (svg != '')
        io.to(socket.id).emit('initsvg', svg)
        //io.to(socket.id).emit('initsvg', '  ')
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

io.on('connection', function (socket) {
    socket.on('create', function (msg) {
      //  console.log('message: ' + msg);
        socket.broadcast.emit('create', msg);
    });

    socket.on('delete', function (msg) {
       // console.log('message: ' + msg);
        socket.broadcast.emit('delete', msg);
    });

    socket.on('broadcastsvg', function (msg) {
        socket.broadcast.emit('broadcastsvg', msg);
    });
    socket.on('savesvg', function (msg) {
        svg = msg;
    });
    socket.on('modify_g', function (msg) {
        socket.broadcast.emit('modify_g', msg);
    });
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


http.listen(8080);
