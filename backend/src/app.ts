import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import passport from 'passport';

// import { authenticationMiddleware } from './authMiddleware';

import { router as indexRouter } from './routes/index';
import { router as apiDocsRouter } from './routes/apiDocs';
import { router as authRouter } from './routes/auth';
import { router as buildingRouter } from './routes/buildings';

const app = express();
const port = 8080;

// Indent JSON
if (process.env.NODE_ENV !== 'production') {
    app.set('json spaces', 2);
}

app.use(morgan('short'));
app.use(helmet());
app.use(express.json());
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api-docs', apiDocsRouter);
app.use('/auth', authRouter);
app.use('/buildings', buildingRouter);

app.listen(port, () => {
    console.log(`Get A Room! API listening at http://localhost:${port}`);
});
