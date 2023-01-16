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

// namespace

const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined the ${data.room} room!`);
    })
    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');

        tech.emit('message', 'User disconnected');
    })
});
