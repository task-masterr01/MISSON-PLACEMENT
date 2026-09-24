const express = require('express');
const cors = require('cors');
const{ Pool } =require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5001 ;

const pool  = new Pool({
    user: process.env.DB_USER ,
    host : process.env.DB_HOST ,
    database: process.env.DB_NAME ,
    password:process.env.DB_PASSWORD ,
    port: process.env.DB_PORT ,
});

app.use(cors());
app.use(express.json());

// ==========================================
// MIDDLEWARE: Verify JWT Token
// ==========================================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        req.user = decodedUser;
        next();
    });
};

// ==========================================
// AUTH ROUTES
// ==========================================

// POST — Register a new user
app.post('/api/register',  async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({ error: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Registration successful!", token, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// POST — Login an existing user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const user = userCheck.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful!", token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ==========================================
// PROTECTED CRUD ROUTES (verifyToken applied)
// ==========================================

// GET — fetch all applications
app.get('/api/applications' , verifyToken , async (req ,res) =>{
    try{
        const result = await pool.query(
            'SELECT * FROM applications ORDER BY date_applied DESC'
        );
        res.json(result.rows);
    } catch(err){
        res.status(500).json({ error : err.message});
    }
});


// GET — fetch all interviews for a specific application
app.get('/api/applications/:id/interviews',verifyToken, async (req, res) => {
    try {
        const { id } = req.params; // Grabs the ID from the URL
        const result = await pool.query(
            'SELECT * FROM interviews WHERE application_id = $1 ORDER BY interview_date ASC',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST — create a new application
app.post('/api/applications' , verifyToken,async(req , res) => {
    try{
        const {company , role , status , notes , link} = req.body ;
        const result = await pool.query(
            'INSERT INTO applications (company, role, status, notes, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [company , role , status , notes , link]
        ) ;
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

// POST — create a new interview for a specific application
app.post('/api/applications/:id/interviews', verifyToken,  async (req, res) => {
    try {
        const application_id = req.params.id;
        const { round_type, interview_date, feedback } = req.body;
        
        const result = await pool.query(
            'INSERT INTO interviews (application_id, round_type, interview_date, feedback) VALUES ($1, $2, $3, $4) RETURNING *',
            [application_id, round_type, interview_date, feedback]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT — update an existing application's status

app.put('/api/applications/:id' ,verifyToken,  async (req , res) =>{
    try{
        const {id} = req.params ;
        const {status ,notes} = req.body ;
        const result = await pool.query(
            'UPDATE applications SET status = $1, notes = $2 WHERE id = $3 RETURNING *',
            [status , notes , id]
        );
        res.json(result.rows[0]);
    } catch (err){
        res.status(500).json({error :err.message}) ;
    }
});

// DELETE — remove an application
app.delete('/api/applications/:id' ,verifyToken,  async (req , res)=>{
    try{
        const {id} = req.params ;
        await pool.query('DELETE FROM applications where id = $1' , [id]);
        res.json({message: 'application deleted'});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

app.listen( PORT , ()=>{
    console.log(`Job Tracker server running on http://localhost:${PORT}`)
});

