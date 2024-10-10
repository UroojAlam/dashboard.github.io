const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
let receivedData = {}; // Variable to store the received data
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'labviewData'
});

// Create a table if it doesn't exist
connection.query(
    `CREATE TABLE IF NOT EXISTS sensor_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        variable VARCHAR(255),
        value DECIMAL(10, 2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err, results) => {
        if (err) throw err;
        console.log("Table created or already exists");
    }
);


// Serve static HTML file
app.use(express.static('public'));

// Use body-parser to parse incoming JSON
app.use(bodyParser.json());

// Endpoint to handle HTTP POST from LabVIEW
app.post('/receive-data', (req, res) => {
    labviewData = req.body;
    console.log('Data received:', labviewData);
    for (const [key, value] of Object.entries(receivedData)) {
        const query = `INSERT INTO sensor_data (variable, value) VALUES (?, ?)`;
        connection.query(query, [key, value], (err, result) => {
            if (err) throw err;
            console.log('Data inserted:', result);
        });
    }
    res.json({ message: 'Data saved to database' });
    res.send({message: 'Data received successfully', data: labviewData});
});

app.get('/get-data', (req, res) => {
    // Send the stored data when the client requests it
    res.json(labviewData);
});
app.get('/get-latest-data', (req, res) => {
    const query = `SELECT variable, value FROM sensor_data ORDER BY timestamp DESC LIMIT 1`;
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching data' });
        } else {
            res.json(results[0]); // Return the latest record
        }
    });
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
