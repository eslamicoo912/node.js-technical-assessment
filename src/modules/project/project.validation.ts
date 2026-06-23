import { z } from 'zod';

export const createProjectSchema = z.object({
    body: z.object({
        title: z
            .string({ message: 'Project title is required' })
            .min(3, { message: 'Title must be at least 3 characters long' })
            .trim(),
        description: z
            .string({ message: 'Project description is required' })
            .min(5, { message: 'Description must be at least 5 characters long' })
            .trim(),
        status: z
            .enum(['Pending', 'In Progress', 'Completed'], { error: 'Status must be either Pending, In Progress, or Completed' })
            .optional(),
    }),
});

export const updateProjectSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(3, { message: 'Title must be at least 3 characters long' })
            .trim()
            .optional(),
        description: z
            .string()
            .min(5, { message: 'Description must be at least 5 characters long' })
            .trim()
            .optional(),
        status: z
            .enum(['Pending', 'In Progress', 'Completed'], { error: 'Status must be either Pending, In Progress, or Completed' })
            .optional(),
    }),
});