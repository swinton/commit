module.exports = {
  moduleFileExtensions: ["js", "ts"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  verbose: true,
};
