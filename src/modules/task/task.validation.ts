import { z } from 'zod';

export const createTaskSchema = z.object({
    body: z.object({
        title: z
            .string({ message: 'Task title is required' })
            .min(3, { message: 'Title must be at least 3 characters long' })
            .trim(),
        description: z
            .string({ message: 'Task description is required' })
            .min(5, { message: 'Description must be at least 5 characters long' })
            .trim(),
        status: z.enum(['Pending', 'In Progress', 'Done'], {
            error: 'Status must be either Pending, In Progress, or Done',
        })
            .optional(),
        priority: z.enum(['Low', 'Medium', 'High'], {
            error: 'Priority must be either Low, Medium, or High',
        })
            .optional(),
        dueDate: z
            .string({ message: 'Due date is required' })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Please provide a valid ISO date format (e.g., YYYY-MM-DD)',
            }),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(3).trim().optional(),
        description: z.string().min(5).trim().optional(),
        status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
        priority: z.enum(['Low', 'Medium', 'High']).optional(),
        dueDate: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Please provide a valid ISO date format',
            })
            .optional(),
    }),
});