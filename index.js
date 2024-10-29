const express = require('express');
const http = require('http');
const https = require('https');
const async = require('async');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;

function fetchTitle(address, callback) {
    const formattedAddress = address.startsWith('http') ? address : `http://${address}`;
    const protocol = formattedAddress.startsWith('https') ? https : http;

    protocol.get(formattedAddress, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const titleMatch = data.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : 'NO RESPONSE';
            callback(null, `<li>${address} - "${title}"</li>`);
        });
    }).on('error', () => {
        callback(null, `<li>${address} - NO RESPONSE</li>`);
    });
}

app.get('/I/want/title', (req, res) => {
    const addresses = Array.isArray(req.query.address) ? req.query.address : [req.query.address];
    
    async.map(addresses, fetchTitle, (err, results) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching titles');
        }
        
        const responseHtml = `
            <html>
                <head></head>
                <body>
                    <h1>Following are the titles of given websites:</h1>
                    <ul>${results.join('')}</ul>
                </body>
            </html>`;
        
        res.send(responseHtml);
    });
});

app.use((req, res) => {
    return res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});