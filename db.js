require('dotenv').config(); 
const mysql = require('mysql2');

// Log the connection configuration
console.log('Connecting to MySQL with the following configuration:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Create a single connection using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 30000
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', {
            message: err.message,
            code: err.code,
            errno: err.errno,
            stack: err.stack
        });
        return;
    }
    console.log('Connected to MySQL database successfully!');
});

// Add a query to test the connection after successful connection
connection.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Error running test query:', err);
    } else {
        console.log('Test query result:', results);
    }
});

module.exports = connection;
