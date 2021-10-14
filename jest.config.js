module.exports = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "src"],
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig-jest.json",
    },
  },
  setupFilesAfterEnv: ["./src/setupTest.ts"],
  testEnvironment: "jsdom",
};
