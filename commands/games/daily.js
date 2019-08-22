const { Command } = require('discord.js-commando');

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name        : 'daily',
			group       : 'games',
			memberName  : 'daily',
			description : 'Claim your daily 200 HappyBunch coins!',
			guildOnly   : true
		});
	}

	async run(message, args) {
		const { getDatabase, setDatabase, updateDatabase } = require('../../database/postgres');
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please claim your daily coins :moneybag: here <@${message.author.id}>`);
			return;
		}
		let coin = await getDatabase(message.author.id, message.guild.id);
		if (coin == undefined) setDatabase(message.author.id, message.guild.id);
		coin = await getDatabase(message.author.id, message.guild.id);
		if (!args.length && !coin.is_claimed) {
			coin.coins = coin.coins + 200;
			coin.is_claimed = true;
			await updateDatabase(coin);
			message.delete();
			message.reply('you received your **200** HappyBunch coin rewards!');
			return;
		} else if (!args.length && coin.is_claimed) {
			message.reply('sorry, you have already claimed your rewards. Please claim again tomorrow.');
			return;
		}
	}
};
