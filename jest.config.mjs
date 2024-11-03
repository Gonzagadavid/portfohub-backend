export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/app/", "/node_modules/", "/tests/"],
  coverageReporters: ['clover', 'json', 'lcov', 'html',['text', {skipFull: true}]],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 30,
      lines: 50,
      statements: 50,
    },
  },
  coverageProvider: "v8",
  transform: {},
  setupFiles: ["<rootDir>/tests/setup-env.js"]
};
