import { checkEnvVariables } from './checkEnvVariables';

const TEST_ENV_VARIABLES = {
    GOOGLE_CLIENT_ID: 'Test ID',
    GOOGLE_CLIENT_SECRET: 'Test secret',
    GOOGLE_CUSTOMER_ID: 'Test customer ID'
};

describe('checkEnvVariables', () => {
    beforeEach(() => {
        process.env = {
            GOOGLE_CLIENT_ID: 'Test ID',
            GOOGLE_CLIENT_SECRET: 'Test secret',
            GOOGLE_CUSTOMER_ID: 'Test customer ID'
        };
    });

    test('Should fail without Google Client ID', () => {
        process.env.GOOGLE_CLIENT_ID = undefined;
        expect(() => {
            checkEnvVariables();
        }).toThrow('Client id');
    });

    test('Should fail without Google Client secret', () => {
        process.env.GOOGLE_CLIENT_SECRET = undefined;
        expect(() => {
            checkEnvVariables();
        }).toThrow('Client secret');
    });

    test('Should fail without Google Workspace customer id', () => {
        process.env.GOOGLE_CUSTOMER_ID = undefined;
        expect(() => {
            checkEnvVariables();
        }).toThrow('Workspace customer id');
    });

    test('Should fail with empty Google Client ID', () => {
        process.env.GOOGLE_CLIENT_ID = '';
        expect(() => {
            checkEnvVariables();
        }).toThrow('Client id');
    });

    test('Should fail with empty Google Client secret', () => {
        process.env.GOOGLE_CLIENT_SECRET = '';
        expect(() => {
            checkEnvVariables();
        }).toThrow('Client secret');
    });

    test('Should fail with empty Google Workspace customer id', () => {
        process.env.GOOGLE_CUSTOMER_ID = '';
        expect(() => {
            checkEnvVariables();
        }).toThrow('Workspace customer id');
    });

    test('Should replace double quotes in env variables', () => {
        process.env = {
            GOOGLE_CLIENT_ID: '"Test ID"',
            GOOGLE_CLIENT_SECRET: '"Test secret"',
            GOOGLE_CUSTOMER_ID: '"Test customer ID"'
        };

        checkEnvVariables();

        expect(process.env.GOOGLE_CLIENT_ID).toEqual('Test ID');
        expect(process.env.GOOGLE_CLIENT_SECRET).toEqual('Test secret');
        expect(process.env.GOOGLE_CUSTOMER_ID).toEqual('Test customer ID');
    });
});
