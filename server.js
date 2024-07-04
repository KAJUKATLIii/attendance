require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const port = process.env.PORT || 10000;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ATTENDANCE_FILE = path.join(__dirname, 'attendance.csv');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for JSON body parsing
app.use(bodyParser.json());

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
    fs.appendFile(ATTENDANCE_FILE, attendanceRecord, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to record attendance' });
        }

        // Calculate attendance percentage (dummy implementation)
        const totalDays = 30; // Example total days
        const attendanceData = [];
        fs.createReadStream(ATTENDANCE_FILE)
            .pipe(csv())
            .on('data', (row) => {
                if (row.barcode === barcode) {
                    attendanceData.push(row);
                }
            })
            .on('end', async () => {
                const attendanceCount = attendanceData.length;
                const attendancePercentage = ((attendanceCount / totalDays) * 100).toFixed(2);

                const embed = {
                    title: 'Attendance Report',
                    description: `**College Name**: RUNGTA\n**Branch**: ${branch}\n**Attendance Percentage**: ${attendancePercentage}%\n**Scanned ID**: ${barcode}\n**Date**: ${date}`,
                    image: {
                        url: 'https://cdn.discordapp.com/attachments/935622008136429588/1257604789882060860/standard.gif'
                    }
                };

                try {
                    await axios.post(DISCORD_WEBHOOK_URL, { embeds: [embed] });
                    res.status(200).json({ message: 'Attendance recorded and notification sent successfully' });
                } catch (error) {
                    console.error('Error sending webhook:', error);
                    res.status(500).json({ error: 'Failed to send webhook' });
                }
            });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
