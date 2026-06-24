import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { UserModel } from '../../src/database/models/user.model';

describe('Auth Module - Integration Tests', () => {

    // setting up database connection
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        const testUri = 'mongodb://localhost:27017/task_manager_db_test';
        await mongoose.connect(testUri);
    });

    // cleaning the user collection after each test run
    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    // disconnecting from MongoDB after the test finishes
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should create a new user profile and return a valid JSON payload with 201', async () => {
            const payload = {
                name: 'test user',
                email: 'test@example.com',
                password: 'password123',
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe(payload.email);

            // verify data was written to the test collection
            const databaseUser = await UserModel.findOne({ email: payload.email });
            expect(databaseUser).toBeTruthy();
        });

        it('should reject registration requests with a 400 error if input validation fails via Zod', async () => {
            const invalidPayload = {
                name: 'test',
                email: 'bad-email-format', // invalid email format
                password: '12', // password too short
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(invalidPayload);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe('fail');
        });
    });
});