# Auth Mastery API

A robust authentication backend demonstrating secure user registration, login, and protected routes using JWT (JSON Web Tokens) and bcrypt password hashing. Built with Express and PostgreSQL.

## Features
- **Secure Registration:** Passwords are never stored in plain text. `bcrypt` is used to hash passwords with a salt factor of 10.
- **Stateless Authentication:** `jsonwebtoken` (JWT) is used for secure, session-less authorization.
- **Protected Routes:** Custom middleware (`verifyToken`) ensures only authenticated users can access specific endpoints.
- **PostgreSQL Integration:** User data is managed in a relational database.

## Technologies Used
- Node.js & Express.js
- PostgreSQL (`pg`)
- `bcrypt` (Password hashing)
- `jsonwebtoken` (JWT for auth)
- `dotenv` (Environment management)
- `cors` (Cross-Origin Resource Sharing)

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- A database created for the project.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   Run the following SQL to create the `users` table:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DB_USER=your_postgres_username
   DB_PASSWORD=180905
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret_key
   PORT=5002
   ```

4. **Start the Server:**
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:5002`

## API Endpoints

### 1. Register User
- **URL:** `/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:** `200 OK` (Returns success message and user name) | `401 Unauthorized` (If user already exists)

### 2. Login User
- **URL:** `/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:** `200 OK` (Returns JWT token) | `401 Unauthorized` (Invalid email or password)

### 3. Access Protected Dashboard
- **URL:** `/dashboard`
- **Method:** `GET`
- **Headers:** 
  `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK` (Returns welcome message and user info) | `401/403` (Access denied due to missing or invalid token)
