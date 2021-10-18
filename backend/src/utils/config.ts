export const PROD_DB_NAME = 'getARoomDB';
export const DEV_DB_NAME = 'getARoomDevDB';

export const getDatabaseUrl = () => {
    const { NODE_ENV, DB_USER, DB_PASSWORD, DB_URL } = process.env;
    const isProduction = NODE_ENV === 'production';
    return createDatabaseUrl(DB_USER, DB_PASSWORD, DB_URL, isProduction);
};

export const createDatabaseUrl = (
    dbUser?: string,
    dbPassword?: string,
    dbUrl?: string,
    isProduction = false
) => {
    if (!dbUser) {
        throw new Error('Database user not defined');
    }
    if (!dbPassword) {
        throw new Error('Database password not defined');
    }
    if (!dbUrl) {
        throw new Error('Database url not defined');
    }
    const databaseName = isProduction ? PROD_DB_NAME : DEV_DB_NAME;

    return `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}/${databaseName}?retryWrites=true&w=majority`;
};
