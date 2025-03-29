const socket = io();

const form = document.getElementById('form');
const formNick = document.getElementById('form2');
const privateForm = document.getElementById('private-form');
const input = document.getElementById('input');
const inputNick = document.getElementById('inputnick');
const privateTo = document.getElementById('private-to');
const privateMessage = document.getElementById('private-message');
const messages = document.getElementById('messages');
const usersOnline = document.getElementById('users-online');
const typingStatus = document.getElementById('typing-status');

let typing = false;
let typingTimeout;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        socket.emit('chat message', input.value);
        const item = document.createElement('li');
        item.textContent = `Você: ${input.value}`;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
        input.value = '';
    }
});

formNick.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inputNick.value.trim()) {
        socket.emit('set nick', inputNick.value);
        inputNick.value = '';
    }
});

privateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (privateTo.value.trim() && privateMessage.value.trim()) {
        socket.emit('private message', { to: privateTo.value, message: privateMessage.value });
        const item = document.createElement('li');
        item.textContent = `🔒 Para ${privateTo.value}: ${privateMessage.value}`;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
        privateMessage.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('private message', ({ from, message }) => {
    const item = document.createElement('li');
    item.textContent = `🔒 De ${from}: ${message}`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('update users', (users) => {
    usersOnline.textContent = users.join(', ');
});

input.addEventListener('input', () => {
    if (!typing) {
        typing = true;
        socket.emit('typing', true);
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typing = false;
        socket.emit('typing', false);
    }, 1200);
});

socket.on('typing', (msg) => {
    typingStatus.textContent = msg;
});