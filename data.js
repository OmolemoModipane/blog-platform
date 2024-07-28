const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'posts.json');

// Helper function to read posts from JSON file
const readPosts = () => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
};

// Helper function to write posts to JSON file
const writePosts = (posts) => {
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf8');
};

// Get all posts
const getPosts = () => {
  return readPosts();
};

// Add a new post
const addPost = (newPost) => {
  const posts = readPosts();
  newPost.id = posts.length ? Math.max(posts.map(p => p.id)) + 1 : 1;
  newPost.likes = 0;
  newPost.comments = []; // Initialize comments
  posts.push(newPost);
  writePosts(posts);
  return newPost;
};

// Like a post
const likePost = (postId) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes++;
    writePosts(posts);
    return { likes: post.likes };
  }
  return null;
};

// Add a comment to a post
const addComment = (postId, comment) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push(comment);
    writePosts(posts);
    return post;
  }
  return null;
};

module.exports = { getPosts, addPost, likePost, addComment };

