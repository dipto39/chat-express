import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const mongoURI: string = process.env.MONGO_URI || '';
// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

export default db;
