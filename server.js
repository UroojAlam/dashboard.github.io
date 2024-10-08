const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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
    const labviewData = req.body; // Store the received data
    console.log('Data received:', labviewData);
    
    // Use a Promise to handle database insertion
    const insertPromises = Object.entries(labviewData).map(([key, value]) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO sensor_data (variable, value) VALUES (?, ?)`;
            connection.query(query, [key, value], (err, result) => {
                if (err) return reject(err); // Reject the promise on error
                console.log('Data inserted:', result);
                resolve(result);
            });
        });
    });

    // Wait for all insert operations to complete
    Promise.all(insertPromises)
        .then(() => {
            res.json({ message: 'Data saved to database', data: labviewData });
        })
        .catch(err => {
            console.error('Error inserting data:', err);
            res.status(500).json({ message: 'Error saving data to database' });
        });
});

// Endpoint to get the latest data
app.get('/get-latest-data', (req, res) => {
    const query = `SELECT variable, value, timestamp FROM sensor_data ORDER BY timestamp DESC LIMIT 10`;
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching data' });
        } else {
            
            results = results.map(row => ({
                variable: row.variable,
                value: row.value,
                timestamp: row.timestamp.toISOString() // Convert to a string
            }));
            console.log('Results from database:', results); // Log the results
            res.json(results); // Return the latest record
          
        }
    });
});

// Endpoint to get the latest data for a specific sensor
app.get('/get-history/:sensor', (req, res) => {
    const sensor = req.params.sensor;
    const query = `SELECT variable, value, timestamp FROM sensor_data WHERE variable = ? ORDER BY timestamp DESC`;

    connection.query(query, [sensor], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching data' });
        } else {
            console.log('Results from database for history of sensor:', results); // Log the results
            
            res.json(results); // Return all records for the specified sensor
        }
    });
});

// Endpoint to get all historical data
app.get('/get-all-history', (req, res) => {
    const query = `SELECT variable, value, timestamp FROM sensor_data ORDER BY timestamp DESC`;

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching data' });
        } else {
            console.log('Results from database for all history:', results); // Log the results
            res.json(results); // Return all historical records
        }
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
