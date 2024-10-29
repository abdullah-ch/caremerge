const express = require('express');
const http = require('http');
const https = require('https');
const { from } = require('rxjs');
const { mergeMap, map, toArray, catchError } = require('rxjs/operators');
require('dotenv').config();

const app = express();
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

app.get('/I/want/title', (req, res) => {
    const addresses = Array.isArray(req.query.address) ? req.query.address : [req.query.address];
    
    // Convert addresses to an observable stream
    from(addresses).pipe(
        // Fetch title for each address as an observable
        mergeMap(address => from(fetchTitle(address)).pipe(
            catchError(() => from([`<li>${address} - NO RESPONSE</li>`])) // Handle errors within the stream
        )),
        toArray(), // Collect all results into an array once completed
        map(results => {
            // Construct the response HTML
            return `
                <html>
                    <head></head>
                    <body>
                        <h1>Following are the titles of given websites:</h1>
                        <ul>${results.join('')}</ul>
                    </body>
                </html>`;
        })
    ).subscribe({
        next: (responseHtml) => res.send(responseHtml), // Send the HTML response
        error: (err) => res.status(500).send('An error occurred while fetching titles'), // Send error response on failure
    });
});

app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});