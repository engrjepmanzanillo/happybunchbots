const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roll',
			group: 'games',
			memberName: 'roll',
			description: 'Roll dice',
			guildOnly: true
		});
	}

	run(message, args) {
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please play here <@${message.author.id}>`);
			return;
		}
		if (!args.length) {
			let randomNum = Math.floor(Math.random() * 24 + 1);
			message.delete(500);
			message.reply(`You rolled ${randomNum}.`);
			return;
		}
	}
};
