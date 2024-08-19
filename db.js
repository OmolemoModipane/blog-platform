require('dotenv').config(); 
const mysql = require('mysql2');

// Log the connection configuration
console.log('Connecting to MySQL with the following configuration:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Create a connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,   // Wait for a connection if none are available
    connectionLimit: 10,        // Maximum number of connections in the pool
    queueLimit: 0,              // No limit on the number of queued requests
    connectTimeout: 30000       // 30 seconds connection timeout
});

// Test connection after successful connection pool creation
pool.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Error running test query:', err);
    } else {
        console.log('Test query result:', results);
    }
});

module.exports = pool.promise(); // Export the pool with promise-based queries
