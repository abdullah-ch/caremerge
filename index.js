const express = require('express');
const http = require('http');
const https = require('https');
const Q = require('q');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;

function fetchTitle(address) {
    const deferred = Q.defer(); 
    const formattedAddress = address.startsWith('http') ? address : `http://${address}`;
    const protocol = formattedAddress.startsWith('https') ? https : http;

    protocol.get(formattedAddress, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const titleMatch = data.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : 'NO RESPONSE';
            deferred.resolve(`<li>${address} - "${title}"</li>`); // Resolve the promise
        });
    }).on('error', () => {
        deferred.resolve(`<li>${address} - NO RESPONSE</li>`); // Resolve with an error message
    });

    return deferred.promise; // Return the promise
}

app.get('/I/want/title', (req, res) => {
    const addresses = Array.isArray(req.query.address) ? req.query.address : [req.query.address];
    
    // Map each address to a fetchTitle promise
    Q.all(addresses.map(fetchTitle))
        .then(results => {
            const responseHtml = `
                <html>
                    <head></head>
                    <body>
                        <h1>Following are the titles of given websites:</h1>
                        <ul>${results.join('')}</ul>
                    </body>
                </html>`;
            res.send(responseHtml);
        })
        .catch(() => {
            res.status(500).send('An error occurred while fetching titles');
        });
});

app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});