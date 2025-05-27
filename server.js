const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LOG_DIR = process.env.LOG_DIR || './logs';
const LOG_FILE = process.env.LOG_FILE || 'log.txt';
const LOG_FORMAT = process.env.LOG_FORMAT || 'json';

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
    const logPath = path.join(LOG_DIR, LOG_FILE);
    const time = new Date().toISOString();

    const logData = {
        time,
        method: req.method,
        url: req.url,
        headers: req.headers,
        ip: req.socket.remoteAddress
    };

    let logString = '';
    if (LOG_FORMAT === 'json') {
        logString = JSON.stringify(logData) + '\n';
    } else {
        logString = `[${time}] ${req.method} ${req.url} from ${req.socket.remoteAddress}\n`;
    }

    fs.appendFile(logPath, logString, (err) => {
        if (err) console.error('Помилка запису в лог:', err);
    });

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Запит отримано і зафіксовано.\n');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});
