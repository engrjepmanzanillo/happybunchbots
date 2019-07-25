//const settings = require('./settings.json');

module.exports = {
	name: 'gw',
	description: 'command setting for GW notifications',
	aliases: [ 'guildwar' ],
	cooldown: 5,
	execute(message, args) {
		if (!message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.reply("Sorry, you don't have a permission to use that");
		}
		//console.log(message.member.hasPermission('MANAGE_CHANNELS'));

		if (!args.length) {
			return message.reply('Please specify ON or OFF');
		}
		let settings;
		if (args[0].toUpperCase() === 'ON') {
			settings === 'ON';
		} else if (args[0].toUpperCase() === 'OFF') {
			settings === 'OFF';
		} else if (args[0].toUpperCase() === 'STATUS') {
			return message.channel.send('Reminder for Guild War was set to');
		} else {
			return message.reply('Please specify ON or OFF');
		}

		message.channel.send(`Reminder for Guild Was was set to ${settings}`);
	}
};
