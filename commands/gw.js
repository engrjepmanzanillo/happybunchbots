//const settings = require('./settings.json');

module.exports = {
	name: 'gw',
	description: 'command setting for GW notifications',
	aliases: [ 'guildwar' ],
	cooldown: 5,
	execute(message, args) {
		// if (!message.author.hasPermission('MANAGE_CHANNEL')) {
		// 	message.reply("Sorry, you don't have a permission to use that");
		// }
		console.log(message.author);
		if (!args.length) {
			message.reply('Please specify ON or OFF');
		}
		let settings = args[0].toUpperCase();
		if (settings === 'ON') {
			message.channel.send('Reminder for Guild War was set ON.');
		} else if (settings === 'OFF') {
			message.channel.send('Reminder for Guild War was set OFF.');
		}
	}
};
