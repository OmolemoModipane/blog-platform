require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database connection pool

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
    pool.end((err) => {
        if (err) console.error('Error during MySQL disconnection:', err);
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Get all blog posts
app.get('/api/posts', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM posts');
        res.json(results);
    } catch (err) {
        handleError(err, res);
    }
});

// Get new blog posts
app.get('/api/posts/new', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 5');
        res.json(results);
    } catch (err) {
        handleError(err, res);
    }
});

// Like a post
app.post('/api/posts/:id/like', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    try {
        const [result] = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post liked successfully' });
    } catch (err) {
        handleError(err, res);
    }
});

// Create a new post
app.post('/api/posts', async (req, res) => {
    const { title, content, author_id } = req.body;

    // Check for missing fields
    if (!title || !content || !author_id) {
        return res.status(400).json({ error: 'Missing required fields: title, content, and author_id' });
    }

    try {
        const [result] = await pool.query('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)', [title, content, author_id]);
        res.json({ id: result.insertId, message: 'Post created successfully' });
    } catch (err) {
        handleError(err, res);
    }
});

// Add a comment to a post
app.post('/api/posts/:id/comments', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { content, author_id } = req.body;

    // Check for missing fields
    if (!content || !author_id) {
        return res.status(400).json({ error: 'Missing required fields: content and author_id' });
    }

    try {
        const [result] = await pool.query('INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)', [content, postId, author_id]);
        res.json({ id: result.insertId, message: 'Comment added successfully' });
    } catch (err) {
        handleError(err, res);
    }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    try {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        handleError(err, res);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
