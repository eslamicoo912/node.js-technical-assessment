import { Document, Types } from 'mongoose';

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskInput {
  title: string;
  description: string;
  status?: 'Pending' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface IUpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

export interface ITaskFilters {
  status?: 'Pending' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
}