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

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

const SECRET_KEY = "TOPSECRETWORD";

app.get('/shop', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shops LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
