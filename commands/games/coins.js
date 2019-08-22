const { Command } = require('discord.js-commando');

module.exports = class CoinCommand extends Command {
	constructor(client) {
		super(client, {
			name        : 'coins',
			group       : 'games',
			memberName  : 'coins',
			description : 'Check your coin balance.',
			guildOnly   : true,
			throttling  : {
				usages   : 1,
				duration : 30
			}
		});
	}

	async run(message, args) {
		const { getDatabase, setDatabase } = require('../../database/postgres');
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please check your coin balance here <@${message.author.id}>`);
			return;
		}
		let coin = await getDatabase(message.author.id, message.guild.id);
		if (coin == undefined) setDatabase(message.author.id, message.guild.id);
		coin = await getDatabase(message.author.id, message.guild.id);
		if (!args.length) {
			message.reply(`you currently have **${coin.coins}** HappyBunch Coins.`);
		}
	}
};
