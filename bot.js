require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const csv = require('csv-parser');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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
            });
    }
});

client.login(DISCORD_BOT_TOKEN);
