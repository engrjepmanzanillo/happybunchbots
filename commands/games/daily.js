const { Command } = require('discord.js-commando');

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			group: 'games',
			memberName: 'daily',
			description: 'Claim your daily 200 HappyBunch coins!',
			guildOnly: true
		});
	}

	run(message, args) {
		const { getDatabase, setDatabase } = require('../../database/db');
		let coin = getDatabase(message.author.id, message.guild.id);
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please claim your daily coins :moneybag: here <@${message.author.id}>`);
			return;
		}
		if (!coin) {
			message.reply(
				"Sorry, you don't have any points yet. Please say something or greet us first then try again :smile:"
			);
			return;
		}
		if (!args.length && !coin.isClaimed) {
			coin.coins = coin.coins + 200;
			coin.isClaimed = true;
			setDatabase(coin);
			message.delete();
			message.reply('You received your 200 HappyBunch coin rewards!');
			return;
		} else if (!args.length && coin.isClaimed) {
			message.reply('Sorry, you have already claimed your rewards. Please claim again tomorrow.');
			return;
		}
	}
};
