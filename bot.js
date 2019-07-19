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
	sched.scheduleJob('1 * * * *', () => {
		channel.send('@everyone Kingdom Events (test) in 5 minutes.');
	});

	//KE at 10:00
	sched.scheduleJob('* 11 * * *', () => {
		channel.send('@everyone Kingdom Events (10:00) in 5 minutes.');
	});
	//KE at 12:00
	sched.scheduleJob('* 13 * * *', () => {
		channel.send('@everyone Kingdom Events (12:00) in 5 minutes.');
	});
	//KE at 14:00
	sched.scheduleJob('* 15 * * *', () => {
		channel.send('@everyone Kingdom Events (14:00) in 5 minutes.');
	});
	//KE at 16:00
	sched.scheduleJob('* 17 * * *', () => {
		channel.send('@everyone Kingdom Events (16:00) in 5 minutes.');
	});
	//KE at 18:00
	sched.scheduleJob('* 19 * * *', () => {
		channel.send('@everyone Kingdom Events (18:00) in 5 minutes.');
	});
	//KE at 22:00
	sched.scheduleJob('* 23 * * *', () => {
		channel.send('@everyone Kingdom Events (22:00) in 5 minutes.');
	});
});

client.on('message', (msg) => {
	if (msg.content === 'ping') {
		msg.reply('pong!');
	}
});

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.find((ch) => ch.name === 'member-log');

	if (!channel) return;

	channel.send(`Welcome to the HappyBunch, ${member}`);
});

client.login(auth.token);
