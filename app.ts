import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http'; // Import HTTP server to integrate with Socket.IO
import { Server } from 'socket.io';
import db from './app/database/db'; // Import the MongoDB connection
import apiRoutes from './app/routes/api';

// Create Express application
const app: Application = express();
const port = process.env.PORT || 8000;

// Create an HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Adjust the origin based on your front-end
    methods: ['GET', 'POST'],
  },
});

// Use CORS middleware
app.use(cors({
  origin: '*', // Allow all origins, or specify a specific origin like 'http://example.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server with Socket.IO');
});

// API routes
app.use('/api', apiRoutes);

// Establish MongoDB connection
db.on('connected', () => {
  console.log('MongoDB is connected.');
});

// Setup Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Example event: Listening for 'message' event
  socket.on('message', (msg) => {
    console.log(`Message received: ${msg}`);
    io.emit('message', msg); // Broadcast the message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
