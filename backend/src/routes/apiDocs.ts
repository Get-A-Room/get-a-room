import express from 'express';
import swaggerDocument from '../swagger.json';

export const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
    import('swagger-ui-express').then((swaggerUi) => {
        router.use('/', swaggerUi.serve);
        router.get('/', swaggerUi.setup(swaggerDocument));
    });
}
