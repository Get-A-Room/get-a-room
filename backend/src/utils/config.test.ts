import { createDatabaseUrl, getDatabaseUrl } from './config';

describe('config', () => {
    describe('getDatabaseUrl', () => {
        test('Should return database url', () => {
            process.env = {
                DB_USER: 'username',
                DB_NAME: 'getARoomDevDB',
                DB_PASSWORD: 'password',
                DB_URL: 'dbUrl'
            };

            const correct =
                'mongodb+srv://username:password@dbUrl/getARoomDevDB?retryWrites=true&w=majority';
            const generated = getDatabaseUrl();

            expect(generated).toEqual(correct);
        });
    });

    describe('createDatabaseUrl', () => {
        test('Should fail without db user', () => {
            expect(() => {
                createDatabaseUrl(
                    undefined,
                    'getARoomDevDB',
                    'password',
                    'dbUrl'
                );
            }).toThrow('user');
        });

        test('Should fail without db password', () => {
            expect(() => {
                createDatabaseUrl(
                    'username',
                    'getARoomDevDB',
                    undefined,
                    'dbUrl'
                );
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

        test('Should fail without db name', () => {
            expect(() => {
                createDatabaseUrl('username', undefined, 'password', 'dbUrl');
            }).toThrow('name');
        });

        test('Should create url containing username:password@dbUrl', () => {
            expect(
                createDatabaseUrl(
                    'username',
                    'getARoomDevDB',
                    'password',
                    'dbUrl'
                )
            ).toContain('username:password@dbUrl');
        });

        test('Should use database that is given as parameter', () => {
            expect(
                createDatabaseUrl('username', 'getARoomDB', 'password', 'dbUrl')
            ).toContain('getARoomDB');
        });
    });
});
