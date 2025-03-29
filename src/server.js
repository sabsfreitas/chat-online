const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = new Map();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.data.nick = `Usuário-${socket.id.substring(0, 5)}`;
    users.set(socket.id, socket.data.nick);
    io.emit('chat message', `🔵 ${socket.data.nick} entrou no chat.`);
    io.emit('update users', Array.from(users.values()));

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', `💬 ${socket.data.nick}: ${msg}`);
    });

    socket.on('set nick', (newNick) => {
        const oldNick = socket.data.nick;
        socket.data.nick = newNick.trim() || oldNick;
        users.set(socket.id, socket.data.nick);
        io.emit('chat message', `✏️ ${oldNick} agora é ${socket.data.nick}`);
        io.emit('update users', Array.from(users.values()));
    });

    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', isTyping ? `${socket.data.nick} está digitando...` : '');
    });

    socket.on('private message', ({ to, message }) => {
        const recipient = [...io.sockets.sockets.values()].find(s => s.data.nick === to);
        if (recipient) {
            recipient.emit('private message', { from: socket.data.nick, message });
        }
    });

    socket.on('disconnect', () => {
        users.delete(socket.id);
        io.emit('chat message', `🔴 ${socket.data.nick} saiu do chat.`);
        io.emit('update users', Array.from(users.values()));
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});