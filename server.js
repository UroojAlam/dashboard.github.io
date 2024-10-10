const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
let receivedData = {}; // Variable to store the received data


// Serve static HTML file
app.use(express.static('public'));

// Use body-parser to parse incoming JSON
app.use(bodyParser.json());

// Endpoint to handle HTTP POST from LabVIEW
app.post('/receive-data', (req, res) => {
    labviewData = req.body;
    console.log('Data received:', labviewData);
    res.send({message: 'Data received successfully', data: labviewData});
});

app.get('/get-data', (req, res) => {
    // Send the stored data when the client requests it
    res.json(labviewData);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
