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
		const { getDatabase, setDatabase, setUserdata } = require('../../database/postgres');
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please claim your daily coins :moneybag: here <@${message.author.id}>`);
			return;
		}
		let coin = getDatabase(message.author.id, message.guild.id);
		if (!coin) coin = setUserdata(message.author.id, message.guild.id);
		if (!args.length && !coin.isClaimed) {
			coin.coins = coin.coins + 200;
			coin.isClaimed = 1;
			setDatabase(coin);
			message.delete();
			message.reply('you received your **200** HappyBunch coin rewards!');
			return;
		} else if (!args.length && coin.isClaimed) {
			message.reply('sorry, you have already claimed your rewards. Please claim again tomorrow.');
			return;
		}
	}
};
