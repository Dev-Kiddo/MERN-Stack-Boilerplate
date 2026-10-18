import mongoose from 'mongoose';

export interface DBStatus {
  stateCode: number;
  status: string;
  host: string | null;
  name: string | null;
}

/**
 * Connect to MongoDB database
 * Handles connection lifecycle events and provides connection status
 */
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_practice';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`💡 Tip: Make sure MongoDB is running locally (mongod) or provide a cloud MongoDB Atlas URI in server/.env`);
  }
};

/**
 * Returns human-readable MongoDB connection state
 */
export const getDBStatus = (): DBStatus => {
  const states: Record<number, string> = {
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
