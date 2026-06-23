import { Schema, model } from 'mongoose';
import { IProject } from '../../modules/project/project.interfaces';

const ProjectSchema = new Schema<IProject>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

export const ProjectModel = model<IProject>('Project', ProjectSchema);