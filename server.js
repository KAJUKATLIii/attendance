require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Initialize express app
const app = express();
const port = process.env.PORT || 10000;

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Discord bot and webhook configurations
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ATTENDANCE_FILE = path.join(__dirname, 'attendance.csv');

// Discord bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Discord bot message event
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!attendance') {
        const barcode = args[0];
        if (!barcode) {
            return message.reply('Please provide a barcode.');
        }

        const attendanceData = [];

        fs.createReadStream(ATTENDANCE_FILE)
            .pipe(require('csv-parser')())
            .on('data', (row) => {
                if (row.barcode === barcode) {
                    attendanceData.push(row);
                }
            })
            .on('end', () => {
                const attendanceCount = attendanceData.length;
                message.reply(`${barcode} was recorded for ${attendanceCount} days.`);
            })
            .on('error', (error) => {
                console.error('Error reading attendance file:', error);
                message.reply('An error occurred while reading the attendance file.');
            });
    }
});

// Login to Discord
client.login(DISCORD_BOT_TOKEN);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for JSON body parsing
app.use(bodyParser.json());

// Scan route
app.post('/scan', async (req, res) => {
    const { barcode, branch, date, subject } = req.body;

    if (!barcode || !branch || !date || !subject) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const attendanceRecord = `${date},${barcode},${branch}\n`;

    fs.appendFile(ATTENDANCE_FILE, attendanceRecord, async (err) => {
        if (err) {
            console.error('Error appending to attendance file:', err);
            return res.status(500).json({ error: 'Failed to record attendance' });
        }

        // Calculate attendance percentage (dummy implementation)
        const totalDays = 30; // Example total days
        const attendanceData = [];
        fs.createReadStream(ATTENDANCE_FILE)
            .pipe(require('csv-parser')())
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
                    await axios.post(DISCORD_WEBHOOK_URL, {
                        embeds: [embed]
                    });
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
