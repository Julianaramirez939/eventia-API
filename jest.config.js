// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  // evita que Jest se queje de posibles handles abiertos en CI
  testTimeout: 20000,
};
