const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roll',
			group: 'games',
			memberName: 'roll',
			description: 'Roll dice and earn coins!',
			guildOnly: true
		});
	}

	run(message, args) {
		const { getDatabase, setDatabase, setUserData } = require('../../database/postgres');
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete();
			channel.send(`Please play here <@${message.author.id}>`);
			return;
		}
		let coin = getDatabase(message.author.id, message.guild.id);
		if (!coin) coin = setUserData(message.author.id, message.guild.id);
		if (!args.length && coin.rollTimes < 10) {
			let randomNum = Math.floor(Math.random() * 24 + 1);
			let coinReward = parseInt(Math.floor(randomNum / 2));
			message.delete();
			coin.rollTimes++;
			message.reply(
				`You rolled **${randomNum}**. You just earned ${coinReward} HappyBunch coin(s)!. (Roll attempts: ${coin.rollTimes}/10)`
			);
			coin.coins = coin.coins + coinReward;
			coin.points++;
			setDatabase(coin);
			return;
		} else if (!args.length && coin.rollTimes > 10) {
			message.delete();
			message.reply('Sorry, you can only roll 10 times daily!');
			return;
		}
	}
};
