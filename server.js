require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');  // Ensure you have node-fetch installed (`npm install node-fetch`)

const app = express();
const port = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ATTENDANCE_FILE = path.join(__dirname, 'attendance.csv');

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!attendance') {
        const studentName = args.join(' ');
        if (!studentName) {
            return message.reply('Please provide a student name.');
        }

        if (!fs.existsSync(ATTENDANCE_FILE)) {
            return message.reply('Attendance file not found.');
        }

        const attendanceData = [];
        fs.createReadStream(ATTENDANCE_FILE)
            .pipe(require('csv-parser')())
            .on('data', (row) => {
                if (row.name === studentName) {
                    attendanceData.push(row);
                }
            })
            .on('end', () => {
                const attendanceCount = attendanceData.length;
                message.reply(`${studentName} was present for ${attendanceCount} days.`);
            })
            .on('error', (error) => {
                console.error('Error reading attendance file:', error);
                message.reply('An error occurred while reading the attendance file.');
            });
    }
});

client.login(DISCORD_BOT_TOKEN);

app.use(bodyParser.json());

app.post('/scan', (req, res) => {
    const { name, branch, subject } = req.body;
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (!name || !branch || !subject) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const attendanceData = `${name},${branch},${date},${subject},Present\n`;

    fs.appendFile(ATTENDANCE_FILE, attendanceData, (err) => {
        if (err) {
            console.error('Error appending to attendance file:', err);
            return res.status(500).json({ error: 'Failed to record attendance' });
        }

        // Send data to Discord webhook
        const embed = {
            title: 'Student Attendance Recorded',
            fields: [
                { name: 'Student Name', value: name },
                { name: 'Branch', value: branch },
                { name: 'Subject', value: subject },
                { name: 'Date', value: date }
            ],
            image: { url: 'https://cdn.discordapp.com/attachments/935622008136429588/1257604789882060860/standard.gif?ex=6685033b&is=6683b1bb&hm=3bde77e68241f376a083ef720b98470bdd1f539aae92f2e32a7d04b1393c923f&' }
        };

        fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        })
        .then(response => response.json())
        .then(() => {
            res.status(200).json({ message: 'Attendance recorded successfully' });
        })
        .catch(error => {
            console.error('Error sending webhook:', error);
            res.status(500).json({ error: 'Failed to send webhook' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
