export const checkEnvVariables = () => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CUSTOMER_ID } =
        process.env;

    if (!GOOGLE_CLIENT_ID) {
        throw new Error('Client id not set');
    }

    if (!GOOGLE_CLIENT_SECRET) {
        throw new Error('Client secret not set');
    }

    if (!GOOGLE_CUSTOMER_ID) {
        throw new Error('Workspace customer id not set');
    }

    // Remove double quotes if there are any
    process.env.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID.replace(/^"|"$/g, '');
    process.env.GOOGLE_CUSTOMER_ID = GOOGLE_CUSTOMER_ID.replace(/^"|"$/g, '');
    process.env.GOOGLE_CLIENT_SECRET = GOOGLE_CLIENT_SECRET.replace(
        /^"|"$/g,
        ''
    );

    console.info('Google environment variables - OK');
};
