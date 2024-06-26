Overview
This project is a Blog Platform API built using Node.js and Express.js, leveraging MongoDB for data storage. It supports user authentication and authorization, secure password storage, file uploads, and distinguishes between regular users and publishers.



Technologies Used

Backend

Node.js: JavaScript runtime for server-side programming.

Express.js: Web framework for Node.js, facilitating the creation of APIs and web servers.

MongoDB: NoSQL database for flexible, scalable, and efficient data storage.

Mongoose: ODM library for MongoDB, used for schema creation and data manipulation.

Bcrypt: Library for hashing passwords, ensuring secure storage and authentication.

Cors: Middleware to enable Cross-Origin Resource Sharing, allowing controlled access to resources from different origins.

Dotenv: Module for loading environment variables from a .env file into process.env.

Jsonwebtoken (JWT): Standard for securely transmitting information between parties as JSON objects, used for implementing stateless authentication mechanisms.

Multer: Middleware for handling multipart/form-data, primarily used for file uploads.

Features

User Types

Publisher: Users with publisher privileges, allowing them access to certain restricted routes and functionalities.

User: Regular users who utilize the platform's services without publisher privileges.



Authentication and Authorization

Token-Based Authentication: Users are authenticated using JSON Web Tokens (JWT), providing a secure and stateless authentication mechanism.

Password Hashing: User passwords are hashed using the bcrypt library before being stored in the database, ensuring data security.

Token Expiry: JWT tokens are issued with an expiration time, enhancing security by limiting the lifespan of authentication tokens.

Database

MongoDB is selected as the database solution due to its flexibility, scalability, and cost-effectiveness. The NoSQL nature of MongoDB allows for easy schema adaptation and supports dynamic relationships, making it ideal for rapid development and deployment scenarios.


Installation

Clone the repository

bash

Copy code

git clone <repository-url>

Navigate to the project directory

bash

Copy code

cd blog-platform-api

Install dependencies

bash

Copy code

npm install

Create a .env file in the root directory and add your environment variables

plaintext

Copy code
PORT=5000

MONGODB_URI=<your-mongodb-uri>

JWT_SECRET=<your-jwt-secret>

Start the server

bash

Copy code

npm start

API Endpoints

User Routes

POST /api/users/register: Register a new user

POST /api/users/login: Login a user and receive a JWT token

PATCH /api/users/edit: Edit user details (protected route)

Post Routes

POST /api/posts/create: Create a new post (protected route)

GET /api/posts: Get all posts

GET /api/posts/

: Get a single post by ID

GET /api/posts/categories/

: Get posts by category

GET /api/posts/users/

: Get posts by a specific user

PATCH /api/posts/

: Edit a post (protected route)

DELETE /api/posts/

: Delete a post (protected route)

Middleware
authMiddleware: Middleware to protect routes and authorize users using JWT.
 
 
