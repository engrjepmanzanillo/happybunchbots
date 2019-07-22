const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const sched = require('node-schedule');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const guild = client.guilds.get('601663719650623498');
	const channel = guild.channels.get('601663877335482389');
	if (!channel) return;
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
		channel.send('@everyone Assemble! Guildwar in 30 minutes!');
	});

	sched.scheduleJob('55 20 * * 2,4', () => {
		channel.send('@everyone Guildwar in 5 minutes!');
	});

	sched.scheduleJob('*/15 * * * *', () => {
		channel.send('@everyone test message every 15 minutes!');
	});
});

client.on('message', (msg) => {
	if (msg.content === '!ping') {
		msg.reply('pong!');
	}
	let date = new Date();
	let currentHour = date.getHours();
	let currentMinute = date.getMinutes();

	if (msg.content === '!time') {
		msg.reply(`Its ${currentHour}:${currentMinute} (${currentHour - 1}:${currentMinute} - Game Time)`);
	}
});

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.find((ch) => ch.name === 'member-log');

	if (!channel) return;

	channel.send(`Welcome to the HappyBunch, ${member}`);
});

client.login(auth.token);
