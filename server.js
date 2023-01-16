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
    console.log('a user connected');
    socket.on('message', (msg) => {
        console.log(`message: ${msg}`);
        tech.emit('message', msg);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');

        tech.emit('message', 'User disconnected');
    })
});
