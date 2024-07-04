require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
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
        const studentName = args.join(' ');
        if (!studentName) {
            return message.reply('Please provide a student name.');
        }

        const attendanceData = [];

        fs.createReadStream(ATTENDANCE_FILE)
            .pipe(csv())
            .on('data', (row) => {
                if (row.name === studentName) {
                    attendanceData.push(row);
                }
            })
            .on('end', () => {
                const attendanceCount = attendanceData.length;
                if (attendanceCount > 0) {
                    message.reply(`${studentName} was present for ${attendanceCount} days.`);
                } else {
                    message.reply(`${studentName} has no recorded attendance.`);
                }
            })
            .on('error', (error) => {
                console.error('Error reading attendance file:', error);
                message.reply('An error occurred while reading the attendance file.');
            });
    }
});

// Login to Discord
client.login(DISCORD_BOT_TOKEN);
