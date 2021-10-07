import { createDatabaseUrl, DEV_DB_NAME, PROD_DB_NAME } from './config';

describe('createDatabaseUrl', () => {
    test('Should fail without db user', () => {
        expect(() => {
            createDatabaseUrl(false, undefined, 'password');
        }).toThrow('credentials');
    });

    test('Should fail without db password', () => {
        expect(() => {
            createDatabaseUrl(false, 'username', undefined);
        }).toThrow('credentials');
    });

    test('Should create url containing username:password', () => {
        expect(createDatabaseUrl(false, 'username', 'password')).toContain(
            'username:password'
        );
    });

    test('Should use development database by default', () => {
        expect(createDatabaseUrl(undefined, 'username', 'password')).toContain(
            DEV_DB_NAME
        );
    });

    test('Should use production database in production environment', () => {
        expect(createDatabaseUrl(true, 'username', 'password')).toContain(
            PROD_DB_NAME
        );
    });

    test('Should use development database in dev environment', () => {
        expect(createDatabaseUrl(false, 'username', 'password')).toContain(
            DEV_DB_NAME
        );
    });
});
