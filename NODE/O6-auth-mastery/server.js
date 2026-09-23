const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // NEW: For hashing passwords
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// ==========================================
// ROUTE 1: REGISTRATION (Sign Up)
// ==========================================
app.post('/register', async (req, res) => {
    try {
        // 1. Get the data the user typed in the frontend
        const { name, email, password } = req.body;

        // 2. Check if the user already exists in the database
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({ error: "User already exists!" });
        }

        // 3. Encrypt the password! NEVER save raw passwords.
        // The '10' is the "salt rounds" — how many times it gets scrambled.
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Save the new user to the database WITH the scrambled password
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        // 5. Send success message (but don't send the password back!)
        res.json({ message: "User registered successfully!", user: newUser.rows[0].name });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ==========================================
// ROUTE 2: LOGIN (Authentication)
// ==========================================
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = userCheck.rows[0];

        // 2. Compare the typed password with the scrambled database password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Passwords match! Generate
        // the VIP Pass (JWT Token)
        // We put their user ID inside the token. 
        // In reality, 'supersecretkey' goes in your .env file.
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // 4. Send the token back to the frontend
        res.json({ message: "Login successful!", token: token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ==========================================
// ROUTE 3: PROTECTED ROUTE (Authorization)
// ==========================================
// This is called "Middleware".
// It runs BEFORE the route logic to check the VIP pass.
const verifyToken = (req, res, next) => {
    // 1. Grab the token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Format is "Bearer <token>"

    // 2. If there's no token, kick them out
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 3. Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET , (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token." });
        }
        
        // 4. If valid, attach the user info to the request and let them in
        req.user = decodedUser; 
        next(); // This says "Go ahead to the actual route"
    });
};




// Now we use the middleware on a route by putting 'verifyToken' in the middle
app.get('/dashboard', verifyToken, async (req, res) => {
    try {
        // Because of verifyToken, we know exactly who this user is: req.user.id
        const userQuery = await pool.query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
        
        res.json({ 
            message: "Welcome to your private dashboard!", 
            user: userQuery.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});

const jwt = require('jsonwebtoken'); // NEW: For generating the VIP pass
