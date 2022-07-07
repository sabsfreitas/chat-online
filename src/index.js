const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

io.on('connection', (socket) => {
    socket.client.nick = socket.client.id;
    io.emit('chat message', " O usuário " + socket.client.nick + " entrou.");

    socket.on('chat message', (msg) => {
        io.emit('chat message', socket.client.nick + " disse: " + msg);
    });

    socket.on('set nick', (msg) => {
        const oldNick = socket.client.nick;
        io.emit('chat message', `${oldNick} trocou seu nome para ${msg}`);
        socket.client.nick = msg;
    })

    socket.on('disconnect', () => {
      io.emit('chat message', " O usuário " + socket.client.nick + " saiu.");
    });

    socket.on('digitando', (msg) => {
      io.emit('digitando', `${socket.client.nick} ${msg}`);
    });

});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});