import { Document, Types } from 'mongoose';

export interface IProject extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProjectInput {
  title: string;
  description: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
}

export interface IUpdateProjectInput {
  title?: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
}