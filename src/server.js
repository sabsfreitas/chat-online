const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.data.nick = `Usuário-${socket.id.substring(0, 5)}`;

    io.emit('chat message', `🔵 ${socket.data.nick} entrou no chat.`);

    socket.on('chat message', (msg) => {
        io.emit('chat message', `💬 ${socket.data.nick}: ${msg}`);
    });

    socket.on('set nick', (newNick) => {
        const oldNick = socket.data.nick;
        socket.data.nick = newNick.trim() || oldNick;
        io.emit('chat message', `✏️ ${oldNick} agora é ${socket.data.nick}`);
    });

    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', isTyping ? `${socket.data.nick} está digitando...` : '');
    });

    socket.on('disconnect', () => {
        io.emit('chat message', `🔴 ${socket.data.nick} saiu do chat.`);
    });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});