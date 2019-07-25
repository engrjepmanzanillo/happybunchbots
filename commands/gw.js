//const settings = require('./settings.json');

module.exports = {
	name: 'gw',
	description: 'command setting for GW notifications',
	aliases: [ 'guildwar' ],
	cooldown: 5,
	execute(message, member, args) {
		// if (!message.author.hasPermission('MANAGE_CHANNEL')) {
		// 	message.reply("Sorry, you don't have a permission to use that");
		// }
		console.log(member);
		if (!args.length) {
			message.reply('Please specify ON or OFF');
			return;
		}
		let settings = args[0];
		if (settings === 'ON') {
			message.channel.send('Reminder for Guild War was set ON.');
		} else if (settings === 'OFF') {
			message.channel.send('Reminder for Guild War was set OFF.');
		} else {
			message.reply('Please specify ON or OFF');
			return;
		}
	}
};
