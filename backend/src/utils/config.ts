export const DB_URL = 'get-a-room.3b3o5.mongodb.net';
export const PROD_DB_NAME = 'getARoomDB';
export const DEV_DB_NAME = 'getARoomDevDB';

export const getDatabaseUrl = () => {
    const { NODE_ENV, DB_USER, DB_PASSWORD } = process.env;
    const isProduction = NODE_ENV === 'production';
    return createDatabaseUrl(isProduction, DB_USER, DB_PASSWORD);
};

export const createDatabaseUrl = (
    isProduction = false,
    dbUser?: string,
    dbPassword?: string
) => {
    if (!dbUser || !dbPassword) {
        throw new Error('Database credentials not defined');
    }
    const databaseName = isProduction ? PROD_DB_NAME : DEV_DB_NAME;

    return `mongodb+srv://${dbUser}:${dbPassword}@${DB_URL}/${databaseName}?retryWrites=true&w=majority`;
};
