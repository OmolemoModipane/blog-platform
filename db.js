const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',           
    user: 'root',                
    password: 'Omolemo01#',     
    database: 'blog_database',  
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
