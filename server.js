require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const connection = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility function to handle errors
const handleError = (err, res) => {
    console.error('Database query error:', err); // Log detailed error
    res.status(500).json({ error: 'Database query error', details: err.message });
};

// Graceful shutdown
const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    connection.end((err) => {
        if (err) console.error('Error during MySQL disconnection:', err);
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Get all blog posts
app.get('/api/posts', (req, res) => {
    const sql = 'SELECT * FROM posts';
    connection.query(sql, (err, results) => {
        if (err) return handleError(err, res);
        res.json(results);
    });
});

// Get new blog posts 
app.get('/api/posts/new', (req, res) => {
    const sql = 'SELECT * FROM posts ORDER BY created_at DESC LIMIT 5';
    connection.query(sql, (err, results) => {
        if (err) return handleError(err, res);
        res.json(results);
    });
});

// Like a post 
app.post('/api/posts/:id/like', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const sql = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
    connection.query(sql, [postId], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post liked successfully' });
    });
});

// Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);

    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    const sql = 'SELECT * FROM posts WHERE id = ?';
    connection.query(sql, [postId], (err, result) => {
        if (err) return handleError(err, res);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result[0]);
    });
});


// Create a new post
app.post('/api/posts', (req, res) => {
    const { title, content, author_id } = req.body;

    // Check for missing fields
    if (!title || !content || !author_id) {
        return res.status(400).json({ error: 'Missing required fields: title, content, and author_id' });
    }

    const sql = 'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';
    connection.query(sql, [title, content, author_id], (err, result) => {
        if (err) return handleError(err, res);
        res.json({ id: result.insertId, message: 'Post created successfully' });
    });
});

// Add a comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { content, author_id } = req.body;

    // Check for missing fields
    if (!content || !author_id) {
        return res.status(400).json({ error: 'Missing required fields: content and author_id' });
    }

    const sql = 'INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)';
    connection.query(sql, [content, postId, author_id], (err, result) => {
        if (err) return handleError(err, res);
        res.json({ id: result.insertId, message: 'Comment added successfully' });
    });
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const sql = 'DELETE FROM posts WHERE id = ?';
    connection.query(sql, [postId], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
