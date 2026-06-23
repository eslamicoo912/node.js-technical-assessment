import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user.model';
import { ProjectModel } from '../../database/models/project.model';
import { TaskModel } from '../../database/models/task.model';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_manager_db';
        console.log('Connecting to database for seeding...');
        await mongoose.connect(mongoUri);

        // clear out existing collection data to ensure a clean slate
        console.log('Cleaning existing data...');
        await UserModel.deleteMany({});
        await ProjectModel.deleteMany({});
        await TaskModel.deleteMany({});

        // create a dummy password hash
        console.log('Generating password hashes...');
        const hashedPassword = await bcrypt.hash('test123', 10);

        // seed users
        console.log('Seeding users...');
        const users = await UserModel.create([
            {
                name: 'Eslam Ashraf',
                email: 'eslam@example.com',
                password: hashedPassword,
                role: 'Admin',
            },
            {
                name: 'Ahmed Mohamed',
                email: 'ahmed@example.com',
                password: hashedPassword,
                role: 'Member',
            },
        ]);

        const adminUser = users[0];

        // seed a project for the admin user
        console.log('Seeding projects...');
        const project = await ProjectModel.create({
            userId: adminUser._id,
            title: 'project title 1',
            description: 'project description 1',
            status: 'In Progress',
        });

        // seed tasks under that specific project
        console.log('Seeding tasks...');
        await TaskModel.create([
            {
                projectId: project._id,
                title: 'task title 1',
                description: 'task description 1',
                status: 'Done',
                priority: 'High',
                dueDate: new Date('2026-07-15'),
            },
            {
                projectId: project._id,
                title: 'task title 2',
                description: 'task description 2',
                status: 'Pending',
                priority: 'Medium',
                dueDate: new Date('2026-08-01'),
            },
        ]);

        console.log('Database successfully seeded!');
        process.exit(0);
    } catch (error) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    }
};

seedDatabase();