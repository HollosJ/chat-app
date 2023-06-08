const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

let server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://127.0.0.1:5173',
      'https://chat-app-client-d6dk.onrender.com/',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
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

server.listen(process.env.PORT || 3001, () => {
  console.log('Server running...');
});
