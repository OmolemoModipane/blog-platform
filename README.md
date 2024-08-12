Blog Platform Backend
This is the backend server for the Blog Platform application. It handles requests related to blog posts, comments, and user management. The backend is built with Node.js and Express, using MySQL for data storage.

Features
CRUD operations for blog posts.
Add comments to blog posts.
User authentication (sign up and login).
JWT-based authentication for protected routes.
Prerequisites
Node.js (v14 or later)
MySQL (v8 or later)
Getting Started
1. Clone the repository
bash
Copy code
git clone https://github.com/your-username/blog-platform-backend.git
cd blog-platform-backend
2. Install dependencies
bash
Copy code
npm install
3. Set up the database
Create a MySQL database named blog_database.
Update the database configuration in db.js with your MySQL credentials.
4. Run the server
bash
Copy code
npm start
The server will start on http://localhost:3001.

API Endpoints
Public Endpoints
POST /api/auth/signup - Register a new user.
POST /api/auth/login - Log in a user and receive a JWT token.
Protected Endpoints (Require JWT Token)
GET /api/posts - Retrieve all blog posts.
GET /api/posts/new - Retrieve the latest blog posts.
POST /api/posts/:id/like - Like a specific blog post.
POST /api/posts - Create a new blog post.
POST /api/posts/:id/comments - Add a comment to a specific blog post.
DELETE /api/posts/:id - Delete a specific blog post.
Database Schema
Users Table

id (INT) - Primary key.
username (VARCHAR) - User's username.
password (VARCHAR) - User's hashed password.
Posts Table

id (INT) - Primary key.
title (VARCHAR) - Title of the post.
content (TEXT) - Content of the post.
author_id (INT) - Foreign key referencing the user who created the post.
likes (INT) - Number of likes the post has received.
Comments Table

id (INT) - Primary key.
content (TEXT) - Content of the comment.
post_id (INT) - Foreign key referencing the post.
author_id (INT) - Foreign key referencing the user who created the comment.
Authentication
Authentication is currently not implemented. You can add authentication and authorization using packages like passport.js or JWT to secure your API endpoints.

Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

License
This project is licensed under the MIT License.

