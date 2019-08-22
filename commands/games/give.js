const { Command } = require('discord.js-commando');

module.exports = class GiveCommand extends Command {
	constructor(client) {
		super(client, {
			name        : 'give',
			group       : 'games',
			memberName  : 'give',
			description : 'Give someone coins.',
			guildOnly   : true,
			throttling  : {
				usages   : 1,
				duration : 30
			},
			example     : [
				'%give @poity 500'
			],
			args        : [
				{
					key    : 'user',
					prompt : 'Which user do you want to give coins?',
					type   : 'user'
				},
				{
					key    : 'coinsToGive',
					prompt : 'How much do you want to give?',
					type   : 'integer'
				}
			]
		});
	}

	async run(message, { user, coinsToGive }) {
		const { getDatabase, setDatabase, updateDatabase } = require('../../database/postgres');
		if (message.author.id === user.id) {
			message.delete();
			message.reply("you can't give to yourself.");
		}
		let rCoin = await getDatabase(user.id, message.guild.id);
		if (rCoin == undefined) setDatabase(user.id, message.guild.id);
		rCoin = await getDatabase(user.id, message.guild.id);
		let gCoin = await getDatabase(message.author.id, message.guild.id);
		if (gCoin == undefined) setDatabase(message.author.id, message.guild.id);
		gCoin = await getDatabase(message.author.id, message.guild.id);
		if (gCoin.coins < coinsToGive) {
			message.delete();
			message.reply("sorry, you don't have enough coins to give. To check your coin balance, type `%coins`.");
			return;
		}
		gCoin.coins = gCoin.coins - coinsToGive;
		rCoin.coins = rCoin.coins + coinsToGive;
		await updateDatabase(gCoin);
		await updateDatabase(rCoin);
		message.delete();
		message.reply(`you gave **${coinsToGive}** HappyBunch Coins to <@${user.id}>!`);
	}
};
