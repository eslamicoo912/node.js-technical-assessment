/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from '../../src/modules/auth/auth.service';
import { UserRepository } from '../../src/modules/user/user.repository';
import { AppError } from '../../src/shared/utils/app-error';

// mock the user repository
jest.mock('../../src/modules/user/user.repository');

describe('AuthService - Unit Tests', () => {
    let authService: AuthService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        authService = new AuthService();
        mockUserRepository = authService['userRepository'] as jest.Mocked<UserRepository>;
    });

    describe('register', () => {
        const mockInput = {
            name: 'test user',
            email: 'test@test.com',
            password: 'test123',
        };

        it('should successfully register a new user and return a token', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            mockUserRepository.create.mockResolvedValue({
                _id: 'mocked_user_id' as any,
                name: mockInput.name,
                email: mockInput.email,
                password: 'password_123',
                role: 'Member',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const result = await authService.register(mockInput);

            expect(result).toHaveProperty('token');
            expect(result.user.email).toBe(mockInput.email);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockInput.email);
            expect(mockUserRepository.create).toHaveBeenCalled();
        });

        it('should throw an AppError if the email is already registered', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                _id: 'existing_user_id',
                email: mockInput.email,
            } as any);

            await expect(authService.register(mockInput)).rejects.toThrow(AppError);
            await expect(authService.register(mockInput)).rejects.toThrow('Email is already registered');

            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
    });
});