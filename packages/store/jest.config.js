/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./setupTests.js'],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!nanoid)/",
    "/node_modules/(?!@tldraw)/"
   
  ],
};
