// tests/jest.setup.js
// Mock global de redis client para tests unitarios.
// Se usa con jest.config.js en "setupFilesAfterEnv".

jest.mock('../src/cache/redisClient', () => {
  return {
    client: {
      del: jest.fn().mockResolvedValue(1),
      isOpen: false, // por defecto cerrado en unit tests (no fallará por client closed)
    },
    connectRedis: jest.fn().mockResolvedValue(true),
  };
});

// Reset de mocks entre tests
beforeEach(() => {
  jest.clearAllMocks();
});
