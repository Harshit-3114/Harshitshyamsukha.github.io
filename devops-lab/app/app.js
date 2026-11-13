const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <h1>CI/CD Demo App - v1.0</h1>
        <p>Deployed via Jenkins -> Docker -> Kubernetes</p>
        <p>Hostname: ${os.hostname()}</p>
    `);
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});