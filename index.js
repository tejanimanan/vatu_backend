const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev, allow all. For prod, set your frontend URL.
    methods: ['GET', 'POST']
  }
});

// Track online users
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  // When a user authenticates, they should emit 'user_online' with their userId
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Typing indicator
  socket.on('typing', ({ conversationId, from, to }) => {
    // Send to the recipient only
    const toSocket = onlineUsers.get(to);
    if (toSocket) {
      io.to(toSocket).emit('typing', { conversationId, from });
    }
  });
  socket.on('stop_typing', ({ conversationId, from, to }) => {
    const toSocket = onlineUsers.get(to);
    if (toSocket) {
      io.to(toSocket).emit('stop_typing', { conversationId, from });
    }
  });

  // Seen/unseen message status
  socket.on('message_seen', ({ conversationId, messageId, from, to }) => {
    // Notify sender that message was seen
    const toSocket = onlineUsers.get(to);
    if (toSocket) {
      io.to(toSocket).emit('message_seen', { conversationId, messageId, from });
    }
  });

  // Relay chat messages
  socket.on('send_message', (data) => {
    // data: { to, from, message, conversationId, ... }
    // Deliver to recipient if online
    const toSocket = onlineUsers.get(data.to);
    if (toSocket) {
      io.to(toSocket).emit('receive_message', data);
    }
    // Also emit to sender for confirmation
    socket.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    // Remove user from onlineUsers
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
    console.log('User disconnected:', socket.id);
  });
});

// app.use(cors());
  app.use(cors({
    origin: '*', // or your frontend URL for production
    credentials: true
  }));
app.use(bodyParser.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload endpoint
app.post('/api/uploads', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Always use deployed backend URL unless BACKEND_URL is set
  const backendUrl = process.env.BACKEND_URL || 'https://vatu-backend.onrender.com';
  const url = `${backendUrl}/uploads/${req.file.filename}`;
  res.json({ url });
});

// TODO: Use MVC routes here
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/reels', require('./routes/reels'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/api', (req, res) => {
  res.json({ message: 'MyInsta API is running with MongoDB!' });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 