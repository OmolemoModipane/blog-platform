const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const data = require('./data'); // Adjust if needed

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const filePath = path.join(__dirname, 'data', 'posts.json');

// Endpoint to retrieve all blog posts
app.get('/api/posts', (req, res) => {
  res.json(data.getPosts());
});

// Endpoint to like a blog post
app.post('/api/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const result = data.likePost(postId);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Endpoint to create a new blog post
app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  const result = data.addPost(newPost);
  res.json(result);
});

// Endpoint to add a comment to a blog post
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const comment = req.body;
  const result = data.addComment(postId, comment);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Endpoint to delete a comment from a blog post
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;
    
    // Read the posts data from file or database
    let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
    // Find the post and remove the comment
    const post = posts.find(post => post.id === parseInt(postId));
    if (!post) return res.status(404).send('Post not found');
  
    // Ensure each comment has an id
    post.comments = post.comments.filter(comment => comment.id !== parseInt(commentId));
  
    // Save the updated posts data
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
  
    res.send(post);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

