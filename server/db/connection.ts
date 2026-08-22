import mongoose from 'mongoose';
import { seedDatabaseIfEmpty } from './seed';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow_hrms';

  try {
    console.log(`🔌 Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully to dayflow_hrms!');

    // Automatically seed if database is clean
    await seedDatabaseIfEmpty();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.log('⚠️ Running in fallback mode. Ensure MongoDB server is running on port 27017.');
  }
}
