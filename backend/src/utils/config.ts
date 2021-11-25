export const getDatabaseUrl = () => {
    const { DB_USER, DB_NAME, DB_PASSWORD, DB_URL } = process.env;
    return createDatabaseUrl(DB_USER, DB_NAME, DB_PASSWORD, DB_URL);
};

export const createDatabaseUrl = (
    dbUser?: string,
    dbName?: string,
    dbPassword?: string,
    dbUrl?: string
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
    if (!dbName) {
        throw new Error('Database name not defined');
    }

    return `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}/${dbName}?retryWrites=true&w=majority`;
};
