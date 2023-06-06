const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(socket.id, 'joined the server');

  socket.on('join_room', (roomID) => {
    socket.join(roomID);
    console.log(`${socket.id} joined ${roomID}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected from the server');
  });
});

server.listen(3001, () => {
  console.log('Server running...');
});
