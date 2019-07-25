const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const TOKEN = process.env.TOKEN;
const prefix = require('./config.json');
const sched = require('node-schedule');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

const guildWarState = true;

app.get('/', (req, res) => {
	res.send('Connected to server!');
});

app.listen(PORT, () => {
	console.log(`Bot is connected. Listening on port ${PORT}`);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	//const guild = client.guilds.get('601663719650623498');
	const hbguild = client.guilds.get('591183932309897227');
	const gwchannel = hbguild.channels.get('593832445481058319');
	const channel = hbguild.channels.get('602848535456514049');
	// test
	// sched.scheduleJob('*/1 * * * *', () => {
	// 	channel.send('@everyone Kingdom Events (test) in 5 minutes.');
	// });

	//KE at 10:00
	sched.scheduleJob('55 10,12,14,16,18,22 * * *', () => {
		channel.send('@everyone Kingdom Events in 5 minutes.');
	});
	//guildwar
	sched.scheduleJob('30 20 * * 2,4', () => {
		if (guildWarState) {
			gwchannel.send('@everyone Assemble! Guildwar in 30 minutes!');
		} else return;
	});

	sched.scheduleJob('55 20 * * 2,4', () => {
		if (guildWarState) {
			gwchannel.send('@everyone Guildwar is in 5 minutes! Good Luck!');
		} else return;
	});

	// guild ball
	sched.scheduleJob('25 20 * * 1,3,5,7', () => {
		channel.send('Get dressed @everyone! Guild Ball is in 5 minutes!');
	});
	//snow fight
	sched.scheduleJob('55 20 * * 1', () => {
		channel.send('Chill @everyone! Snow Fight is in 5 minutes!');
	});
	// world boss
	sched.scheduleJob('25 12,16,22 * * *', () => {
		channel.send('Prepare @everyone! World Boss is in 5 minutes!');
	});

	//old wombat
	sched.scheduleJob('45 19 * * *', () => {
		channel.send('@everyone! Old Wombat is coming in our Guild territory in 5 minutes! Give him a warm welcome!');
	});
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute your command');
	}

	if (command === 'ping') {
		//message.channel.send('pong!');
		client.commands.get('ping').execute(message, args);
	}
});

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.find((ch) => ch.name === 'main-topic');

	if (!channel) return;

	channel.send(`Welcome to the HappyBunch Guild! ${member}`);
});

client.login(TOKEN);
