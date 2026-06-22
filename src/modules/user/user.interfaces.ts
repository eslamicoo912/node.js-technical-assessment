import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Member';
  createdAt: Date;
  updatedAt: Date;
}