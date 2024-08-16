require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

// Create a connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,          
    user: process.env.DB_USER,          
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME,      
    connectionLimit: 10                 
});

// Promisify the pool's query function
const promisePool = pool.promise();

// Optional: Test the connection
promisePool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database successfully!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to MySQL database:', err.message);
    });

module.exports = promisePool;
