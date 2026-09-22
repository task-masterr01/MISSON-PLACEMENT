const express = require('express');
const cors = require('cors');
const{ Pool } =require('pg');
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

// GET — fetch all applications
app.get('/api/applications' , async (req ,res) =>{
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
app.get('/api/applications/:id/interviews', async (req, res) => {
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
app.post('/api/applications' ,async(req , res) => {
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
app.post('/api/applications/:id/interviews', async (req, res) => {
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

app.put('/api/applications/:id' , async (req , res) =>{
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
app.delete('/api/applications/:id' , async (req , res)=>{
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

