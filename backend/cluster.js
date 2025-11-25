const cluster = require('cluster');
const os = require('os');
const path = require('path');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking for ${numCPUs} CPUs`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        // Replace the dead worker
        cluster.fork();
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    require('./server');
    console.log(`Worker ${process.pid} started`);
}
