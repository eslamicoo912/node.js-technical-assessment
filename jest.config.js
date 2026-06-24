module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
};