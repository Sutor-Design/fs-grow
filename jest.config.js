module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  collectCoverageFrom: ["<rootDir>/src/**"],
  coverageDirectory: "<rootDir>/coverage",
  testMatch: ["<rootDir>/src/**/*.test.+(ts|tsx|js)"],
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
};
