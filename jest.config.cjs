/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
    ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
      "jest-transform-stub",
  },
};
