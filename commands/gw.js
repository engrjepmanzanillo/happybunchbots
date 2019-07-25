const fs = require('fs');

module.exports = {
	name: 'gw',
	description: 'announcement message of availability of guildwar.',
	cooldown: 5,
	execute(message, args) {
		if (!message.author.permissions.has('MANAGE_CHANNELS')) {
			message.reply('Sorry, you do not have permissions to set notifications.');
		}
		let gwData = JSON.parse(fs.readFileSync('./option.json', 'utf8'));
		if (!args.length) {
			message.reply('Please specify ON or OFF');
		}
		guildWarAvailable = gwData.guildWarAvailable;
		const gwSwitch = args[1].toUpperCase();
		if (gwSwitch === 'ON') {
			guildWarAvailable = true;
			message.reply('GW notifications was turned ON!');
		} else if (gwSwitch === 'OFF') {
			guildWarAvailable = false;
		} else {
			message.reply('Please specify ON or OFF');
		}

		fs.writeFile('./option.json', JSON.stringify(gwData), (error) => {
			if (error) console.error(error);
		});
	}
};
