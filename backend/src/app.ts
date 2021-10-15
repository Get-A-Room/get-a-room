import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import {
    authFilter,
    parseAccessToken,
    validateAccessToken
} from './authMiddleware';
import mongoose from 'mongoose';
import { checkEnvVariables } from './utils/checkEnvVariables';

import { router as indexRouter } from './routes/index';
import { router as apiDocsRouter } from './routes/apiDocs';
import { router as authRouter } from './routes/auth';
import { router as buildingRouter } from './routes/buildings';
import { router as roomRouter } from './routes/rooms';
import { getDatabaseUrl } from './utils/config';

const app = express();
const port = 8080;

try {
    checkEnvVariables();
} catch (e: any) {
    // On error, prevent startup
    console.error(e);
    process.exit(1);
}

try {
    mongoose
        .connect(getDatabaseUrl())
        .then(() => console.info('Mongo connection - OK'));
} catch (e: any) {
    console.error(e);
}
// Indent JSON
if (process.env.NODE_ENV !== 'production') {
    app.set('json spaces', 2);
}

app.use(morgan('short'));
app.use(helmet());
app.use(express.json());
app.use(parseAccessToken().unless(authFilter));
app.use(validateAccessToken().unless(authFilter));

app.use('/', indexRouter);
app.use('/api-docs', apiDocsRouter);
app.use('/auth', authRouter);
app.use('/buildings', buildingRouter);
app.use('/rooms', roomRouter);

app.listen(port, () => {
    console.log(`Get A Room! API listening at port ${port}`);
});
