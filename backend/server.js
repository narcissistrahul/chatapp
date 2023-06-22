const express = require('express');
var cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

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
  userName: String,
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
      content: data.content,
      userName: data.userName
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

// Create an endpoint for fetching chat messages
app.get('/messages', async (req, res) => {
  try {
    // Fetch chat messages from the database
    const messages = await Message.find({}, 'sender content userName');
     res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).send('Error fetching chat messages');
  }
});

// Create an endpoint for fetching all chat messages
app.get('/messages/all', async (req, res) => {
  try {
    // Fetch all chat messages from the database
    const messages = await Message.find({}, 'sender content');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).send('Error fetching chat messages');
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});