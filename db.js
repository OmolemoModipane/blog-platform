const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',         // Replace with your MySQL server address
    user: 'root',              // Replace with your MySQL username
    password: 'Omolemo01#',    // Replace with your MySQL password
    database: 'blog_database', // Replace with your MySQL database name
    connectionLimit: 10        // Optional: Set the maximum number of connections in the pool
});

// Promisify the pool query function
const promisePool = pool.promise();

module.exports = promisePool;

