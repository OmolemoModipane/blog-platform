// data.js
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
  try {
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing posts to file:', error);
  }
};


const getPosts = () => {
  return readPosts();
};

// Get new posts (
const getNewPosts = () => {
  const posts = readPosts();
  const now = new Date();
  const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
  return posts.filter(post => new Date(post.createdAt) >= oneWeekAgo);
};

// Add a new post
const addPost = (newPost) => {
  const posts = readPosts();
  newPost.id = posts.length ? Math.max(posts.map(p => p.id)) + 1 : 1;
  newPost.likes = 0;
  newPost.comments = []; 
  newPost.createdAt = new Date().toISOString(); // Add timestamp for creation
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
    comment.id = post.comments.length ? Math.max(post.comments.map(c => c.id)) + 1 : 1; 
    post.comments.push(comment);
    writePosts(posts);
    return post; 
  }
  return null;
};

// Function to delete a post
const deletePost = (postId) => {
  const posts = readPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex > -1) {
    posts.splice(postIndex, 1); 
    writePosts(posts);
    return true; 
  }
  return false; 
};

module.exports = { getPosts, getNewPosts, addPost, likePost, addComment, deletePost };