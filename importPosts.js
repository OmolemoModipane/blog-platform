const fs = require('fs');
const path = require('path');
const pool = require('./db'); // Ensure this points to your db connection pool module

// Load the JSON file
const postsFilePath = path.join(__dirname, 'data/posts.json');
const postsData = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));

// Define the maximum length for comments
const MAX_COMMENT_LENGTH = 500; // Adjust based on your database schema

// Function to insert posts into the database
const insertPosts = async () => {
    try {
        // Create a mapping of author names to IDs (replace with your actual mapping logic)
        const authorIdMap = {
            'Madeline Miles': 1, // Example mapping; replace with actual values
            'YASHI SHARMA': 2,
            'Neptune9': 3,
            'Monique Valcour': 4
            // Add more mappings as needed
        };

        for (const post of postsData) {
            const { title, content, author, date, likes, comments } = post; // Note: Adjust based on your JSON structure

            // Insert the post into the posts table (without 'image')
            const [result] = await pool.query(
                'INSERT INTO posts (title, content, author_id, date, likes) VALUES (?, ?, ?, ?, ?)',
                [title, content, authorIdMap[author] || null, date, likes]
            );
            console.log(`Post "${title}" inserted with ID: ${result.insertId}`);

            // If there are comments, insert them into the comments table
            if (comments && comments.length > 0) {
                for (const comment of comments) {
                    // Truncate comment content if it exceeds the maximum length
                    const truncatedContent = comment.content.length > MAX_COMMENT_LENGTH 
                        ? comment.content.substring(0, MAX_COMMENT_LENGTH) 
                        : comment.content;

                    await pool.query(
                        'INSERT INTO comments (content, posts_id, author_id) VALUES (?, ?, ?)',
                        [truncatedContent, result.insertId, authorIdMap[comment.author] || null]
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
