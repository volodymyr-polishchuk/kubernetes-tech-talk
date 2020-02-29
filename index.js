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
const WAIT = Number(process.env.WAIT || 1000);
const COLLECT_METRIC_PERIOD = process.env.COLLECT_METRIC_PERIOD || 20000;
let processedCount = 0;

app.use(express.static('public'));

let buffer = [];

app.post('/buy', (req, res) => {
    buffer.push({
        req,
        res,
        createdAt: Date.now(),
        remove: false,
        wait: (buffer.length + 1) * WAIT,
    });
});

setInterval(() => {
    buffer.forEach((message) => {
        if (Date.now() - message.createdAt > message.wait) {
            message
                .res
                .status(200)
                .send();
            message.remove = true;
            processedCount++;
        }
    });
    buffer = buffer.filter(value => !value.remove)
}, 20);

setInterval(() => {
    pool.query(`
        INSERT INTO buy_metric(count, created_at, collect_metric_group) 
        VALUES (${processedCount}, DEFAULT, ${Date.now() / COLLECT_METRIC_PERIOD})
        ON CONFLICT (collect_metric_group) DO UPDATE SET 
                                  count = EXCLUDED.count + buy_metric.count,
                                  created_at = EXCLUDED.created_at,
                                  collect_metric_group = EXCLUDED.collect_metric_group
                                  `,
        (results, error) => {
        console.log(results, error);
        console.log(`${new Date().toISOString()} :: processed ${processedCount}`);
    });
    processedCount = 0;
}, COLLECT_METRIC_PERIOD);

app.listen(3000, HOST, () => {
    console.log(`Application hosted on: http://${HOST}:${PORT}`);
    console.log('Example app listening on port 3000!');
});
