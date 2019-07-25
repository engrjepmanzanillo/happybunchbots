//const settings = require('./settings.json');

module.exports = {
	name: 'gw',
	description: 'command setting for GW notifications',
	aliases: [ 'guildwar' ],
	cooldown: 5,
	execute(message, args) {
		if (message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.reply("Sorry, you don't have a permission to use that");
		}
		//console.log(message.member.hasPermission('MANAGE_CHANNELS'));

		if (!args.length) {
			return message.reply('Please specify ON or OFF');
		}
		let settings = args[0].toUpperCase();
		if (settings === 'ON') {
			return message.channel.send('Reminder for Guild War was set ON.');
		} else if (settings === 'OFF') {
			return message.channel.send('Reminder for Guild War was set OFF.');
		} else {
			return message.reply('Please specify ON or OFF');
		}
	}
};
