const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'MSI',
    user: 'quang',
    password: '1',
    database: 'BAOHANH'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});


app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.post('/products', (req, res) => {
    const { product_id, product_name, product_type, purchase_date, warranty_period, warranty_expiry_date } = req.body;
    const sql = 'INSERT INTO products (product_id, product_name, product_type, purchase_date, warranty_period, warranty_expiry_date) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [product_id, product_name, product_type, purchase_date, warranty_period, warranty_expiry_date], (err, result) => {
        if (err) throw err;
        res.sendStatus(201);
    });
});


app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

app.post('/add-customer', (req, res) => {
    const { product_id, customer_id, customer_name, address, phone_number } = req.body;
    const query = 'INSERT INTO customers (product_id, customer_id, customer_name, address, phone_number) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [product_id, customer_id, customer_name, address, phone_number], (err, result) => {
        if (err) {
            res.status(500).send('Database error');
        } else {
            res.status(200).send('Customer added successfully');
        }
    });
});

app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) {
            res.status(500).send('Database error');
        } else {
            res.json(results);
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
