import { MongoClient } from 'mongodb';

let client;
let db;

// Initialize MongoDB connection
export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const DB_NAME = process.env.MONGODB_DB_NAME || 'curricuforge';

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Get database instance
export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
};

// Close MongoDB connection
export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

export default { connectDB, getDB, closeDB };
