const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/contests',
    method: 'GET'
};

const start = Date.now();
let completed = 0;
const total = 100;

for (let i = 0; i < total; i++) {
    const req = http.request(options, (res) => {
        res.on('data', () => { });
        res.on('end', () => {
            completed++;
            if (completed === total) {
                const duration = Date.now() - start;
                console.log(`Total time for ${total} requests: ${duration}ms`);
                console.log(`Average time per request: ${duration / total}ms`);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}
