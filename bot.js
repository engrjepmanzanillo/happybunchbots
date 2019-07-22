const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;
const sched = require('node-schedule');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Connecting');
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
	if (!channel) return;
	// test
	// sched.scheduleJob('*/1 * * * *', () => {
	// 	channel.send('@everyone Kingdom Events (test) in 5 minutes.');
	// });

	//KE at 10:00
	sched.scheduleJob('55 10,12,14,16,18,22 * * *', () => {
		channel.send('@everyone Kingdom Events in 5 minutes.').then((sentMessage) => {
			sentMessage.delete(300000);
		});
	});

	//guildwar
	sched.scheduleJob('30 20 * * 2,4', () => {
		gwchannel.send('@everyone Assemble! Guildwar in 30 minutes!').then((sentMessage) => {
			sentMessage.delete(1500000);
		});
	});

	sched.scheduleJob('55 20 * * 2,4', () => {
		gwchannel.send('@everyone Guildwar is in 5 minutes!').then((sentMessage) => {
			sentMessage.delete(150000);
		});
	});

	// guild ball
	sched.scheduleJob('25 20 * * 1,3,5,7', () => {
		channel.send('Get dressed @everyone! Guild Ball is in 5 minutes!').then((sentMessage) => {
			sentMessage.delete(300000);
		});
	});

	sched.scheduleJob('55 20 * * 1', () => {
		channel.send('Chill @everyone! Snow Fight is in 5 minutes!').then((sentMessage) => {
			sentMessage.delete(150000);
		});
	});
});

client.on('message', (msg) => {
	if (msg.content === '!ping') {
		msg.reply('pong!');
	}
	let date = new Date();
	let currentHour = date.getHours();
	let currentMinute = date.getMinutes();
	let currentSecond = date.getSeconds();
	let amPm = 'AM';
	if (currentMinute < 10) {
		currentMinute = `0${currentMinute}`;
	}
	if (currentSecond < 10) {
		currentSecond = `0${currentSecond}`;
	}
	if (currentHour > 12) {
		currentHour = currentHour - 12;
		amPm = 'PM';
	}
	if (msg.content === '!time') {
		msg
			.reply(
				`Its now ${currentHour}:${currentMinute}:${currentSecond} ${amPm} (${currentHour -
					1}:${currentMinute} ${amPm} - Game Time)`
			)
			.then((sentMessage) => {
				sentMessage.delete(5000);
			});
		msg.delete(500);
	}
});

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.find((ch) => ch.name === 'main-topic');

	if (!channel) return;

	channel.send(`Welcome to the HappyBunch, ${member}`);
});

client.login(TOKEN);
