const express = require('express');
const http = require('http');
const https = require('https');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5001;

function fetchTitle(address) {
    return new Promise((resolve) => {
        const formattedAddress = address.startsWith('http') ? address : `http://${address}`;
        const protocol = formattedAddress.startsWith('https') ? https : http;

        protocol.get(formattedAddress, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const titleMatch = data.match(/<title>(.*?)<\/title>/i);
                const title = titleMatch ? titleMatch[1].trim() : 'NO RESPONSE';
                resolve(`<li>${address} - "${title}"</li>`);
            });
        }).on('error', () => {
            resolve(`<li>${address} - NO RESPONSE</li>`);
        });
    });
}

app.get('/I/want/title', async (req, res) => {
    const addresses = Array.isArray(req.query.address) ? req.query.address : [req.query.address];
    
    const results = await Promise.all(addresses.map(fetchTitle));
    
    // Construct the response HTML
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

app.use((req, res) => {
    res.status(404).send("404 Not Found");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});