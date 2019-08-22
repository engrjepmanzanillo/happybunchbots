const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name        : 'roll',
			group       : 'games',
			memberName  : 'roll',
			description : 'Roll dice and earn coins!',
			guildOnly   : true
		});
	}

	async run(message, args) {
		const { getDatabase, setDatabase, updateDatabase } = require('../../database/postgres');
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please play here <@${message.author.id}>`);
			return;
		}
		let coin = await getDatabase(message.author.id, message.guild.id);
		if (coin == undefined) setDatabase(message.author.id, message.guild.id);
		coin = await getDatabase(message.author.id, message.guild.id);
		if (!args.length && coin.roll_times < 10) {
			let randomNum = Math.floor(Math.random() * 24 + 1);
			let coinReward = parseInt(Math.floor(randomNum / 2));
			message.delete();
			coin.roll_times++;
			message.reply(
				`You rolled **${randomNum}**. You just earned ${coinReward} HappyBunch coin(s)!. (Roll attempts: ${coin.roll_times}/10)`
			);
			coin.coins = coin.coins + coinReward;
			coin.points++;
			await updateDatabase(coin);
			return;
		} else if (!args.length && coin.rollTimes > 10) {
			message.delete();
			message.reply('Sorry, you can only roll 10 times daily!');
			return;
		}
	}
};
