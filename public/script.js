const socket = io();

const form = document.getElementById('form');
const formNick = document.getElementById('form2');
const input = document.getElementById('input');
const inputNick = document.getElementById('inputnick');
const messages = document.getElementById('messages');

let typing = false;
let typingTimeout;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        socket.emit('chat message', input.value);
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

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
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
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.textContent = msg;
});