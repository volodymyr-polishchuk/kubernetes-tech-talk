const express = require('express');

const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOSTNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express();

const PORT = process.env.PORT || 3000;

const HOST = '0.0.0.0';

let WAIT = process.env.WAIT || 1000;
WAIT = Number(WAIT);

app.use(express.static('public'));

app.post('/buy', (req, res) => {
    const first = Date.now();
    while (Date.now() - first < WAIT) {
        Math.pow(Math.random(), Math.random());
    }
    pool.query('INSERT INTO metric(id, created_at) VALUES (DEFAULT, DEFAULT)', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});

app.listen(3000, HOST, () => {
    console.log(`Application hosted on: http://${HOST}:${PORT}`);
    console.log('Example app listening on port 3000!');
});
