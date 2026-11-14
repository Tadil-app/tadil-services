const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../..'),
  testEnvironment: 'node',
  testMatch: ['<rootDir>/libs/infra/tadil-notifications/src/**/*.spec.ts'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      tsconfig: {
        types: ['jest', 'node'],
        esModuleInterop: true,
        target: 'ES2022',
        module: 'commonjs',
        strict: true,
        skipLibCheck: true,
      },
    }],
  },
  moduleNameMapper: {
    '^@tadil-database$': '<rootDir>/libs/infra/tadil-database/src/dbClient.ts',
    '^@tadil-users$': '<rootDir>/libs/core/tadil-users/src/application/user.model.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
};
