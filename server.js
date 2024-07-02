const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle attendance submission
app.post('/attendance', async (req, res) => {
    const { barcode, date } = req.body;

    if (!barcode || !date) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const attendanceRecord = `${date},${barcode}\n`;

    fs.appendFile('attendance.csv', attendanceRecord, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to record attendance' });
        }

        // Send to Discord webhook
        axios.post(DISCORD_WEBHOOK_URL, {
            content: `Attendance recorded for student ID ${barcode} on ${date}`
        })
        .then(() => {
            res.json({ message: 'Attendance recorded and notification sent' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Failed to send notification' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
