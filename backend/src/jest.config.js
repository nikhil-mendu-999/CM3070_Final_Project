module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/test/**/*.spec.ts',
    '**/tests/**/*.spec.ts',
    '**/*.e2e-spec.ts'
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts'
  ]
};
