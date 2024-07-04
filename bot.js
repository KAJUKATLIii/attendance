import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import csv from 'csv-parser';

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Discord bot token
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

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

        const attendanceData = [];

        fs.createReadStream('attendance.csv')
            .pipe(csv())
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

// Login to Discord
client.login(DISCORD_BOT_TOKEN);
