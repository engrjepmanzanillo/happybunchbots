require('dotenv').config();
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const path = require('path');

//declaring environmental variables
const TOKEN = process.env.TOKEN;
const GUILD = process.env.GUILD;

// setting up and run server
const server = require('./helper/server');
server();

//node-scheduler
const sched = require('node-schedule');

// sqlite provider
const sqlite = require('sqlite');

// helper functions

//initiating client
const client = new CommandoClient({
	commandPrefix: '%',
	owner: '233495043451781120'
});
//register client commands
client.registry
	.registerDefaultTypes()
	.registerGroups([ [ 'utils', 'Utilities' ], [ 'games', 'Fun and Games' ] ])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: true
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client
	.setProvider(sqlite.open(path.join(__dirname, 'database.sqlite3')).then((db) => new SQLiteProvider(db)))
	.catch(console.error);

//ready client
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('type %help');
	reminder();
	console.log('reminder functions loaded.');
});

// client on error
client.on('error', console.error);

//
client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.find((ch) => ch.name === 'main-topic');
	// if channel doesn't exists, return
	if (!channel) return;
	channel.send(`@everyone! Let's welcome our new member, ${member}! Welcome to the HappyBunch!`);
});

// client login
client.login(TOKEN);

// auto-reminder functions
function reminder() {
	const guild = client.guilds.get(GUILD);
	const gwChannel = guild.channels.find((ch) => ch.name === 'guildwar-updates');
	const channel = guild.channels.find((ch) => ch.name === 'events-reminder');

	//KE at 10:00
	sched.scheduleJob('55 10,12,14,16,18,22 * * *', () => {
		channel.send('@everyone Kingdom Events in 5 minutes.');
	});
	//guildwar
	sched.scheduleJob('30 20 * * 2,4', () => {
		gwChannel.send('@everyone Assemble! Guildwar in 30 minutes!');
	});

	sched.scheduleJob('55 20 * * 2,4', () => {
		gwChannel.send('@everyone Guildwar is in 5 minutes! Good Luck!');
	});
	//overlord
	sched.scheduleJob('55 20 * * 5', () => {
		channel.send('@everyone Overlord will be opened in 5 minutes! Good Luck!');
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
}
