const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');


dotenv.config();

app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

// Define the endpoints
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(500).send({ message: 'Error retrieving patients' });
    } else {
      res.render('patients', { patients: results });
    }
  });
});

app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(500).send({ message: 'Error retrieving providers' });
    } else {
      res.render('providers', { providers: results });
    }
  });
});

app.get('/patients/:first_name', (req, res) => {
  const firstName = req.params.first_name;
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(500).send({ message: 'Error retrieving patients' });
    } else {
      res.render('patients', { patients: results });
    }
  });
});

app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(500).send({ message: 'Error retrieving providers' });
    } else {
      res.render('providers', { providers: results });
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});