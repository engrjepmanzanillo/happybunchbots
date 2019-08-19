const { Command } = require('discord.js-commando');

module.exports = class GiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give',
			group: 'games',
			memberName: 'give',
			description: 'Give someone coins.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},
			example: [ '%give @poity 500' ],
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to give coins?',
					type: 'user'
				},
				{
					key: 'coinsToGive',
					prompt: 'How much do you want to give?',
					type: 'integer'
				}
			]
		});
	}

	run(message, { user, coinsToGive }) {
		const { getDatabase, setDatabase, setUserData } = require('../../database/db');
		if (message.author.id === user.id) {
			message.delete();
			message.reply("You can't give to yourself.");
		}
		let rCoin = getDatabase(user.id, message.guild.id);
		if (!rCoin) {
			rCoin = setUserData(user.id, message.guild.id);
			setDatabase(rCoin);
		}
		rCoin = getDatabase(user.id, message.guild.id);
		let gCoin = getDatabase(message.author.id, message.guild.id);
		if (!gCoin) {
			gCoin = setUserData(message.author.id, message.guild.id);
			setDatabase(gCoin);
		}
		gCoin = getDatabase(message.author.id, message.guild.id);
		if (gCoin.coins < coinsToGive) {
			message.delete();
			message.reply("Sorry, you don't have enough coins to give. To check your coin balance, type `%coins`.");
			return;
		}
		gCoin.coins = gCoin.coins - coinsToGive;
		rCoin.coins = rCoin.coins + coinsToGive;
		setDatabase(gCoin);
		setDatabase(rCoin);
		message.delete();
		message.reply(`You gave **${coinsToGive}** HappyBunch Coins to <@${user.id}>!`);
	}
};
