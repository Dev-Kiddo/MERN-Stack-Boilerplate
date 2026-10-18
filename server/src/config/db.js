import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Handles connection lifecycle events and provides connection status
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_practice';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`💡 Tip: Make sure MongoDB is running locally (mongod) or provide a cloud MongoDB Atlas URI in server/.env`);
    // Do not crash the entire server process so that the API and health endpoints remain accessible
  }
};

/**
 * Returns human-readable MongoDB connection state
 */
export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    status: states[stateCode] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};
