import mongoose from "mongoose";
import { env } from "../shared/config/env";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGODB_URI || 'mongodb://localhost:27017/task_manager_db';
    
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};