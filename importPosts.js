const fs = require('fs');
const path = require('path');
const pool = require('./db'); // Ensure this points to your db connection pool module

// Load the JSON file
const postsFilePath = path.join(__dirname, 'data/posts.json');
const postsData = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));

// Function to insert posts into the database
const insertPosts = async () => {
    try {
        for (const post of postsData) {
            const { title, content, author_id, date, likes, comments } = post; // Excluded 'image' from destructuring

            // Insert the post into the posts table (without 'image')
            const [result] = await pool.query(
                'INSERT INTO posts (title, content, author_id, date, likes) VALUES (?, ?, ?, ?, ?)',
                [title, content, author_id, date, likes]
            );
            console.log(`Post "${title}" inserted with ID: ${result.insertId}`);

            // If there are comments, insert them into the comments table
            if (comments && comments.length > 0) {
                for (const comment of comments) {
                    await pool.query(
                        'INSERT INTO comments (content, posts_id, author_id) VALUES (?, ?, ?)',
                        [comment.content, result.insertId, author_id]
                    );
                    console.log(`Comment for post ID ${result.insertId} inserted successfully.`);
                }
            }
        }

        console.log('All posts and comments have been inserted.');
    } catch (error) {
        console.error('Error during insertion:', error);
    } finally {
        await pool.end(); // Close the pool
    }
};

// Call the function to insert posts
insertPosts();

