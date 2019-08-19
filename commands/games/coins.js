const { Command } = require('discord.js-commando');

module.exports = class CoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coins',
			group: 'games',
			memberName: 'coins',
			description: 'Check your coin balance.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			}
		});
	}

	run(message, args) {
		const { getDatabase, setDatabase, setUserData } = require('../../database/db');
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please check your coin balance here <@${message.author.id}>`);
			return;
		}
		let coin = getDatabase(message.author.id, message.guild.id);
		if (!coin) {
			coin = setUserData(message.author.id, message.guild.id);
			setDatabase(coin);
		}
		if (!args.length) {
			message.reply(`you currently have **${coin.coins}** HappyBunch Coins.`);
		}
	}
};
