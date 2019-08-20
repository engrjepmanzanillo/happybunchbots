const { Command } = require('discord.js-commando');

module.exports = class BetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bet',
			group: 'games',
			memberName: 'bet',
			description: 'Place your bet! Doubles the prize!',
			guildOnly: true,
			args: [
				{
					key: 'bet',
					prompt: 'Which one do you want to place your bet?',
					type: 'string',
					validate: (text) => {
						if (text === 'odd' || text === 'even') return true;
						return 'Please bet to odd or even.';
					}
				},
				{
					key: 'coinsToBet',
					prompt: 'How much do you want to bet?',
					type: 'integer'
				}
			]
		});
	}

	run(message, { bet, coinsToBet }) {
		const { getDatabase, setDatabase, setUserData } = require('../../database/postgres');
		let bCoin = getDatabase(message.author.id, message.guild.id);
		if (!bCoin) {
			bCoin = setUserData(message.author.id, message.guild.id);
			setDatabase(bCoin);
		}
		bCoin = getDatabase(message.author.id, message.guild.id);
		if (bCoin.coins < coinsToBet) {
			message.reply(
				"sorry, you don't have enough HappyBunch Coins to bet! type `%coins` to check your current balance."
			);
			return;
		}
		let randomNum = Math.floor(Math.random() * 100 + 1);
		let oddEven = randomNum % 2 === 0 ? 'even' : 'odd';
		let prize = coinsToBet * 2;
		message.delete();
		if (bet === oddEven) {
			message.reply(
				`you bet **${bet}** and system drawed **${oddEven}**! You won **${prize}** HappyBunch Coins! Congrats!`
			);
			bCoin.coins = bCoin.coins + coinsToBet;
			setDatabase(bCoin);
		} else {
			message.reply(`you bet on **${bet}** and system drawed **${oddEven}**! Sorry, you lose. :frowning2:`);
			bCoin.coins = bCoin.coins - coinsToBet;
			setDatabase(bCoin);
		}
	}
};
