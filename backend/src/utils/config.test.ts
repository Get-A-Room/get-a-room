import { createDatabaseUrl } from './config';

describe('createDatabaseUrl', () => {
    test('Should fail without db user', () => {
        expect(() => {
            createDatabaseUrl(undefined, 'getARoomDevDB', 'password', 'dbUrl');
        }).toThrow('user');
    });

    test('Should fail without db password', () => {
        expect(() => {
            createDatabaseUrl('username', 'getARoomDevDB', undefined, 'dbUrl');
        }).toThrow('password');
    });

    test('Should fail without db url', () => {
        expect(() => {
            createDatabaseUrl(
                'username',
                'getARoomDevDB',
                'password',
                undefined
            );
        }).toThrow('url');
    });

    test('Should create url containing username:password@dbUrl', () => {
        expect(
            createDatabaseUrl('username', 'getARoomDevDB', 'password', 'dbUrl')
        ).toContain('username:password@dbUrl');
    });

    test('Should use database that is given as parameter', () => {
        expect(
            createDatabaseUrl('username', 'getARoomDB', 'password', 'dbUrl')
        ).toContain('getARoomDB');
    });
});
