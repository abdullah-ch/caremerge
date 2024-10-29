const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 5001;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());

function fetchTitle(address, callback) {
    // Add a default protocol if not present
    const formattedAddress = address.startsWith('http') ? address : `http://${address}`;
    const protocol = formattedAddress.startsWith('https') ? https : http;

    protocol.get(formattedAddress, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const titleMatch = data.match(/<title>(.*?)<\/title>/i);
            callback(null, `<li>${address} - "${titleMatch ? titleMatch[1] : 'NO RESPONSE'}"</li>`);
        });
    }).on('error', () => {
        callback(null, `<li>${address} - NO RESPONSE</li>`);
    });
}

app.get('/I/want/title', (req, res) => {
    const addresses = Array.isArray(req.query.address) ? req.query.address : [req.query.address];
    let titles = [];
    let count = 0;

    addresses.forEach((address, index) => {
        fetchTitle(address, (err, title) => {
            titles[index] = `<li>${address} - "${title}"</li>`;
            count++;
            if (count === addresses.length) {
                res.send(`<html><body><h1>Following are the titles of given websites:</h1><ul>${titles.join('')}</ul></body></html>`);
            }
        });
    });
});

app.use((req, res) => {
    res.status(404).send("404 Not Found");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});