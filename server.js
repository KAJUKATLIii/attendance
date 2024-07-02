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
    const { barcode, date, branch } = req.body;

    if (!barcode || !date || !branch) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const attendanceRecord = `${date},${barcode},${branch}\n`;

    // Save to file (consider using a database for production)
    fs.appendFile('attendance.csv', attendanceRecord, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to record attendance' });
        }

        // For demonstration, setting a placeholder attendance percentage
        const attendancePercentage = '75%'; // Replace with actual calculation

        // Send to Discord webhook with embedded image/gif
        axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [{
                title: 'Attendance Report',
                description: `**College Name**: RUNGTA\n**Branch**: ${branch}\n**Attendance Percentage**: ${attendancePercentage}\n**Scanned ID**: ${barcode}\n**Date**: ${date}`,
                image: {
                    url: 'https://cdn.discordapp.com/attachments/935622008136429588/1257604789882060860/standard.gif'
                }
            }]
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
