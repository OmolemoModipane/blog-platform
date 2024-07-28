const express = require('express');
const cors = require('cors');
const data = require('./data'); // Import the data module

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Endpoint to retrieve all blog posts
app.get('/api/posts', (req, res) => {
  res.json(data.getPosts());
});

// Endpoint to retrieve new posts
app.get('/api/posts/new', (req, res) => {
  res.json(data.getNewPosts());
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
