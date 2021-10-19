/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        // https://stackoverflow.com/questions/45087018/jest-simple-tests-are-slow
        'ts-jest': { isolatedModules: true }
    },
    coverageReporters: ['lcov']
};
