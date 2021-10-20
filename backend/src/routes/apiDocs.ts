import express from 'express';
import swaggerDocument from '../apidoc/swagger.json';
import swaggerUi from 'swagger-ui-express';

export const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
    router.use('/', swaggerUi.serve);
    router.get('/', swaggerUi.setup(swaggerDocument));
}
