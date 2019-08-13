require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const SQLite = require('better-sqlite3');
const sql = new SQLite('./scores.sqlite');
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`${file} is ready.`);
}

//let { guildWarAvailable } = require('./settings.json');
const TOKEN = process.env.TOKEN;
const PHASE = process.env.PHASE;
const DEV_TOKEN = process.env.DEV_TOKEN;
let dToken;
if (PHASE === 'PRODUCTION') {
	dToken = TOKEN;
} else {
	dToken = DEV_TOKEN;
}

const sched = require('node-schedule');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Connected to server!');
});

app.listen(PORT, () => {
	console.log(`Bot is connected. Listening on port ${PORT}`);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity(`type ${prefix}help`);
	let hbguild;
	let gwchannel;
	let channel;

	if (PHASE === 'PRODUCTION') {
		hbguild = client.guilds.get('591183932309897227');
		gwchannel = hbguild.channels.get('593832445481058319');
		channel = hbguild.channels.get('602848535456514049');
	} else if (PHASE === 'DEVELOPMENT') {
		hbguild = client.guilds.get('601663719650623498');
		gwchannel = hbguild.channels.get('608556151923146753');
		channel = hbguild.channels.get('601663877335482389');
	}

	//KE at 10:00
	sched.scheduleJob('55 10,12,14,16,18,22 * * *', () => {
		channel.send('@everyone Kingdom Events in 5 minutes.');
	});
	//guildwar
	sched.scheduleJob('30 20 * * 2,4', () => {
		gwchannel.send('@everyone Assemble! Guildwar in 30 minutes!');
	});

	sched.scheduleJob('55 20 * * 2,4', () => {
		gwchannel.send('@everyone Guildwar is in 5 minutes! Good Luck!');
	});
	//overlord
	sched.scheduleJob('55 20 * * 5', () => {
		gwchannel.send('@everyone Overlord will be opened in 5 minutes! Good Luck!');
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

	// ruin boss
	sched.scheduleJob('55 14,22 * * 5,6', () => {
		channel.send('Prepare @everyone! Ancient Ruin Boss is coming in 5 minutes!');
	});

	// racing
	sched.scheduleJob('55 20 * * 3', () => {
		channel.send('Make you bets @everyone! Racing starts in 5 minutes!');
	});

	// treasure hunt
	sched.scheduleJob('55 13,21 * * *', () => {
		channel.send('Prepare @everyone! Treasure Hunter is in 5 minutes!');
	});

	//old wombat
	sched.scheduleJob('45 19 * * *', () => {
		channel.send('@everyone! Old Wombat is coming in our Guild territory in 5 minutes! Give him a warm welcome!');
	});
	// racoons
	sched.scheduleJob('0 11 * * *', () => {
		channel.send(
			"Ever since the racoons had a taste of candy Old Wombat stole, they've been thirsty for more. Now, those troublemakers have targeted our guild. Be prepared to defend!"
		);
	});

	// point system
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	if (!table['count(*)']) {
		// if table doesn't exists, will create database
		sql
			.prepare('CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);')
			.run();
		// ensuring that id is unique
		sql.prepare('CREATE UNIQUE INDEX idx_scores_id ON scores (id);').run();
		sql.pragma('synchronous = 1');
		sql.pragma('journal_mode = wal');
	}
	// get to prepared statements and set score data
	client.getScore = sql.prepare('SELECT * FROM scores WHERE user = ? AND guild = ?');
	client.setScore = sql.prepare(
		'INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);'
	);
});

client.on('message', (message) => {
	if (message.author.bot) return;
	const score = new xp(message);
	//const score = new xp(message);
	// initiate score system
	console.log(`You have ${score.points} pts and are level ${score.level}`);
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
		console.log('test');
	} catch (error) {
		console.error(error);
		message.reply(
			`There was an error trying to execute your command. Use \`${prefix}help\` to get list of available commands`
		);
	}

	if (command === 'help') {
		//message.channel.send('pong!');
		client.commands.get('help').execute(message, args);
	}

	if (command === 'ping') {
		//message.channel.send('pong!');
		client.commands.get('ping').execute(message, args);
	}
	if (command === 'time') {
		//message.channel.send('pong!');
		client.commands.get('time').execute(message, args);
	}
	if (command === 'roll') {
		client.commands.get('roll').execute(message, args);
	}
});

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.find((ch) => ch.name === 'main-topic');

	if (!channel) return;

	channel.send(`Welcome to the HappyBunch Guild! ${member}`);
});

function xp(message) {
	let score;
	if (message.guild) {
		score = client.getScore.get(message.author.id, message.guild.id);
		if (!score) {
			score = {
				id: `${message.guild.id}-${message.author.id}`,
				user: message.author.id,
				guild: message.guild.id,
				points: 0,
				level: 1
			};
		}
		score.points++;
		const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
		if (score.level < curLevel) {
			score.level++;
			message.reply(`You've level up to Level ${curLevel}! Congrats!`);
		}
		client.setScore.run(score);
	}
	return score;
}

client.login(dToken);
