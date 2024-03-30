/** @type {import('jest').Config} */
module.exports = {
    transform: {
      "^.+\\.(t|j)sx?$": "@swc/jest",
    },
    transformIgnorePatterns: [
    
      "/node_modules/(?!nanoid)/",
    "/node_modules/(?!@tldraw)/",
    ],
  };