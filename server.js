const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/coolest', (req, res) => {
    res.sendFile(__dirname + '/public/coolest.html');
});

app.get('/bad', (req, res) => {
    res.sendFile(__dirname + '/public/bad.html');
});

app.get('/neutral', (req, res) => {
    res.sendFile(__dirname + '/public/neutral.html');
});

// namespace

const bois = io.of('/bois');

bois.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        bois.in(data.room).emit('message', `New user joined the ${data.room} room!`);
        console.log('User connected to room: ' + data.room);

    })
    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        bois.emit('message', data.msg);
    });

    socket.on('connect', () => {
        console.log('User connected');
        bois.emit('message', 'User Connected');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');

        bois.emit('message', 'User Disconnected');
    })
});
