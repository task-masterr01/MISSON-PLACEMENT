const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // This is the postgres driver you installed

const app = express();
const PORT = 5000;

// Database Connection Setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_directory',
    password: '180905', // <--- CHANGE THIS
    port: 5432,
});

app.use(cors());
app.use(express.json());

// Our new route to fetch students from the database
app.get('/api/students', async (req, res) => {
    try {
        // We tell the database to give us everything in the students table
        const result = await pool.query('SELECT * FROM students');
        
        // We send those rows back to the frontend as JSON
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});