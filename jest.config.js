module.exports = {
  "verbose": true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testURL: 'http://localhost/',
  "setupFilesAfterEnv": ["jest-extended"]
};