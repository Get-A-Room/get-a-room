import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();
const port = 8080;

app.use(morgan('short'));
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
