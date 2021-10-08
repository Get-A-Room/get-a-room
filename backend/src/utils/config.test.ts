import { createDatabaseUrl, DEV_DB_NAME, PROD_DB_NAME } from './config';

describe('createDatabaseUrl', () => {
    test('Should fail without db user', () => {
        expect(() => {
            createDatabaseUrl(undefined, 'password', 'dbUrl', false);
        }).toThrow('user');
    });

    test('Should fail without db password', () => {
        expect(() => {
            createDatabaseUrl('username', undefined, 'dbUrl', false);
        }).toThrow('password');
    });

    test('Should fail without db url', () => {
        expect(() => {
            createDatabaseUrl('username', 'password', undefined, false);
        }).toThrow('url');
    });

    test('Should create url containing username:password@dbUrl', () => {
        expect(
            createDatabaseUrl('username', 'password', 'dbUrl', false)
        ).toContain('username:password@dbUrl');
    });

    test('Should use development database by default', () => {
        expect(createDatabaseUrl('username', 'password', 'dbUrl')).toContain(
            DEV_DB_NAME
        );
    });

    test('Should use production database in production environment', () => {
        expect(
            createDatabaseUrl('username', 'password', 'dbUrl', true)
        ).toContain(PROD_DB_NAME);
    });

    test('Should use development database in dev environment', () => {
        expect(
            createDatabaseUrl('username', 'password', 'dbUrl', false)
        ).toContain(DEV_DB_NAME);
    });
});
