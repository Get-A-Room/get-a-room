import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { router as indexRouter } from './routes/index';
import { router as buildingRouter } from './routes/buildings';
import { router as apiDocsRouter } from './routes/apiDocs';

const app = express();
const port = 8080;

// Indent JSON
if (process.env.NODE_ENV !== 'production') {
    app.set('json spaces', 2);
}

app.use(morgan('short'));
app.use(helmet());

app.use('/', indexRouter);
app.use('/buildings', buildingRouter);
app.use('/api-docs', apiDocsRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
