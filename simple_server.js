const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;
const baseDir = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Remove query params
    const cleanUrl = req.url.split('?')[0];
    let filePath = path.join(baseDir, cleanUrl);

    // Default to index.html for root
    if (cleanUrl === '/') {
        filePath = path.join(baseDir, 'index.html');
    }

    const ext = path.extname(filePath);
    let contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            // File exists, serve it
            serveFile(filePath, contentType, res);
        } else {
            // File not found
            // If it looks like an asset (has extension), return 404
            // Otherwise, simple check: if request has no extension or is obviously a route, serve index.html (SPA Fallback)

            if (path.extname(cleanUrl) && !cleanUrl.includes('index.html')) {
                // Probably a missing asset
                res.writeHead(404);
                res.end(`File not found: ${cleanUrl}`);
            } else {
                // SPA Fallback
                const fallbackPath = path.join(baseDir, 'index.html');
                serveFile(fallbackPath, 'text/html', res);
            }
        }
    });

}).listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});

function serveFile(path, type, res) {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end(`Error reading file: ${err.code}`);
        } else {
            res.writeHead(200, { 'Content-Type': type });
            res.end(data);
        }
    });
}
