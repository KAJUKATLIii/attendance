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
        const barcode = args[0];
        if (!barcode) {
            return message.reply('Please provide a barcode.');
        }

        const attendanceData = [];

        fs.createReadStream('attendance.csv')
            .pipe(csv())
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

client.login(DISCORD_BOT_TOKEN);
