const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

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
