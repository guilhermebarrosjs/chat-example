const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const messages = [];

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

io.on('connection', socket => {
    console.log('a user connected:' + socket.id);
    socket.broadcast.emit('user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('a user disconnected.');
        socket.broadcast.emit('user disconnected', socket.id);
    });

    socket.emit('restore messages', messages);

    socket.on('chat message', data => {
        socket.broadcast.emit('chat message others', data);
        socket.emit('chat message self', data);
        messages.push(data);
    });
});

http.listen(3333, () => {
    console.log('listening on localhost:3000');
});