
const express = require('express');
const cors = require('cors');
const data = require('./data'); 

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

//   blog posts
app.get('/api/posts', (req, res) => {
  res.json(data.getPosts());
});

//  new posts
app.get('/api/posts/new', (req, res) => {
  res.json(data.getNewPosts());
});

//  like a post
app.post('/api/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const result = data.likePost(postId);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// create a new post
app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  const result = data.addPost(newPost);
  res.json(result);
});

//  add a comment 
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

// delete a post
app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const result = data.deletePost(postId);
    if (result) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });