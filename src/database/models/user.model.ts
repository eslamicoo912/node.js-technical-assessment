import { Schema, model } from 'mongoose';
import { IUser } from '../../modules/user/user.interfaces';

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['Admin', 'Member'], 
      default: 'Member' 
    }
  },
  { 
    timestamps: true
  }
);

export const UserModel = model<IUser>('User', UserSchema);