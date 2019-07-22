const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
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
	const guild = client.guilds.get('601663719650623498');
	const channel = guild.channels.get('601663877335482389');
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
		channel.send('@everyone Assemble! Guildwar in 30 minutes!').then((sentMessage) => {
			sentMessage.delete(1800000);
		});
	});

	sched.scheduleJob('55 20 * * 2,4', () => {
		channel.send('@everyone Guildwar in 5 minutes!').then((sentMessage) => {
			sentMessage.delete(55000);
		});
	});

	// sched.scheduleJob('5 0,15,30,45 * * * *', () => {
	// 	let date = new Date();
	// 	let currentHour = date.getHours();
	// 	let currentMinute = date.getMinutes();
	// 	let currentSecond = date.getSeconds();
	// 	let amPm = 'AM';
	// 	if (currentMinute < 10) {
	// 		currentMinute = `0${currentMinute}`;
	// 	}
	// 	if (currentSecond < 10) {
	// 		currentSecond = `0${currentSecond}`;
	// 	}
	// 	if (currentHour > 12) {
	// 		currentHour = currentHour - 12;
	// 		amPm = 'PM';
	// 	}
	// 	channel.send(`@everyone Time Check: Its now ${currentHour}:${currentMinute} ${amPm}`).then((sentMessage) => {
	// 		sentMessage.delete(10000);
	// 	});
	// });
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
	const channel = member.guild.channels.find((ch) => ch.name === 'member-log');

	if (!channel) return;

	channel.send(`Welcome to the HappyBunch, ${member}`);
});

client.login(auth.token);
