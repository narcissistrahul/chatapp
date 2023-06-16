const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept']
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Create a message schema
const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle new chat messages
  socket.on('chat message', (data) => {
    console.log('Received message:', data);

    // Save the message to MongoDB
    const message = new Message({
      sender: data.sender,
      content: data.content
    });

    message.save()
      .then(() => {
        console.log('Message saved to MongoDB');
      })
      .catch((error) => {
        console.error('Failed to save message to MongoDB:', error);
      });

    // Broadcast the message to all connected clients
    io.emit('chat message', data);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});