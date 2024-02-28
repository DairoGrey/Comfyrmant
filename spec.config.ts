import { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    testRegex: '(/src/(.*)\\.spec)\\.[jt]sx?$',
    coverageReporters: ['text-summary', 'html-spa'],
    coverageDirectory: '__coverage__',
};

export default config;
