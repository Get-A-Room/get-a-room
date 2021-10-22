import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
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
import { router as bookingRouter } from './routes/booking';
import { router as buildingRouter } from './routes/buildings';
import { router as roomRouter } from './routes/rooms';
import { getDatabaseUrl } from './utils/config';

const app = express();
const port = 8080;

checkEnvVariables();

mongoose
    .connect(getDatabaseUrl())
    .then(() => console.info('Mongo connection - OK'));

// Options for CORS
const corsOptions: CorsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
};

app.use(morgan('short'));
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(parseAccessToken().unless(authFilter));
app.use(validateAccessToken().unless(authFilter));

app.use('/', indexRouter);
app.use('/api-docs', apiDocsRouter);
app.use('/auth', authRouter);
app.use('/booking', bookingRouter);
app.use('/buildings', buildingRouter);
app.use('/rooms', roomRouter);

app.listen(port, () => {
    console.log(`Get A Room! API listening at port ${port}`);
});
