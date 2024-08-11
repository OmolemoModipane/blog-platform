const mysql = require('mysql2');

// connection pool
const pool = mysql.createPool({
    host: 'localhost',         
    user: 'root',              
    password: 'Omolemo01#',   
    database: 'blog_database', 
    connectionLimit: 10        // number of connections in the pool
});

// Promisify the pool query function
const promisePool = pool.promise();

module.exports = promisePool;

