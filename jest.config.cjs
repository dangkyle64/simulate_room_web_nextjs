// jest.config.js
module.exports = {
  transform: {
    // Transpile files with Babel, including those in node_modules
    '^.+\\.[tj]sx?$': 'babel-jest', // This will handle your test files as well
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@babylonjs)/', // This will transpile @babylonjs modules
  ],
  testEnvironment: 'jest-environment-jsdom', // Using jsdom for React testing
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
}
  