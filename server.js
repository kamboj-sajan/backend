import express from "express"
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";


const { Pool } = pg;

const app = express();
const port = 5000;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mocha_delight",
    password: "Nova258@",
    port: 5432,
});
const corsOptions = {
  origin: 'https://mocha-delight.vercel.app', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(bodyParser.json());

const SECRET_KEY = "TOPSECRETWORD";



app.get('/reviews', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM reviews');
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

app.post('/reviews', async (req, res) => {
  try {
      const { name, review } = req.body;
      const newReview = await pool.query(
          'INSERT INTO reviews (name, review) VALUES ($1, $2) RETURNING *',
          [name, review]
      );
      res.json(newReview.rows[0]);
  } catch (err) {
      console.error(err.message);
  }
});
app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message, numberOfPeople } = req.body;
  try {
    const query = 'INSERT INTO contacts (first_name, last_name, email, phone, subject, message, number_of_people) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [firstName, lastName, email, phone, subject, message, numberOfPeople];
    await pool.query(query, values);
    res.status(200).send('Message received');
  } catch (error) {
    console.error('Error saving contact message', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
