import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { OAuth2Client } from 'google-auth-library';
import {
    authFilter,
    parseAccessToken,
    validateAccessToken
} from './authMiddleware';

import { router as indexRouter } from './routes/index';
import { router as apiDocsRouter } from './routes/apiDocs';
import { router as authRouter } from './routes/auth';
import { router as buildingRouter } from './routes/buildings';
import { router as roomRouter } from './routes/rooms';

const app = express();
const port = 8080;

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
    console.log(`Get A Room! API listening at http://localhost:${port}`);
});

declare global {
    namespace Express {
        interface Request {
            token: string;
            oAuthClient: OAuth2Client;
        }
    }
}
