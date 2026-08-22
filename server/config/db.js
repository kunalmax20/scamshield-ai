import mongoose from 'mongoose';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

// Configure reliable DNS servers for Windows SRV resolution (Google & Cloudflare DNS)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[Database] Could not set custom DNS servers, using default OS DNS.');
}

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Atlas connection attempt failed (${error.message}).`);
    console.log('[Database] Initializing In-Memory Fallback MongoDB instance...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const fallbackUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`[Database] MongoDB Connected (In-Memory Development Database Active): ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error(`[Database] Critical Database Error: ${fallbackErr.message}`);
    }
  }
};
