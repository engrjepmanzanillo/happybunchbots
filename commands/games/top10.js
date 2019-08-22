const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class LeaderboardsCommand extends Command {
	constructor(client) {
		super(client, {
			name        : 'top10',
			group       : 'games',
			memberName  : 'top10',
			description : 'Shows top 10 by category.',
			guildOnly   : true,
			throttling  : {
				usages   : 1,
				duration : 30
			},
			example     : [
				'`%top10 coins` for top 10 most richest',
				'`%top10 level` for top 10 most talkative person'
			],
			args        : [
				{
					key      : 'category',
					prompt   : "In which category you want to know who's in top 10?",
					type     : 'string',
					validate : (text) => {
						if (text === 'coins' || text === 'level') return true;
						return 'Please specify `coins` or `level` category';
					}
				}
			]
		});
	}

	async run(message, { category }) {
		const { sortDatabase } = require('../../database/postgres');
		const channel = message.guild.channels.find((ch) => ch.name === 'xp-profiles');
		if (!channel) return;
		if (message.channel.name !== 'xp-profiles') {
			message.delete();
			channel.send(`please lookup here <@${message.author.id}>`);
			return;
		}
		let top10category;
		let embedTitle;
		let valueFormat;
		if (category === 'coins') {
			top10category = 'coins';
			embedTitle = 'Top 10 Richest HappyBunchers';
			valueFormat = 'HappyBunch Coins';
		} else {
			top10category = 'points';
			embedTitle = 'Top 10 Most Talkative HappyBunchers';
			valueFormat = 'Talkative Level';
		}
		const top10 = await sortDatabase(top10category);
		const embed = new RichEmbed().setTitle(embedTitle);
		for (let i = 0; i < top10.length; i++) {
			embed.addField(
				`**${i + 1}** <@${top10[i].discord_user}>`,
				category === 'coins' ? `${top10[i].coins} ${valueFormat}` : `${valueFormat} ${top10[i].level}`
			);
		}
		const top10Data = [];
		top10Data.push(`**${embedTitle}**`);
		for (let i = 0; i < top10.length; i++) {
			top10Data.push(
				`**${i + 1}** <@${top10[i].discord_user}> - ` +
					`${category === 'coins' ? `${top10[i].coins} ${valueFormat}` : `${valueFormat} ${top10[i].level}`}`
			);
		}
		message.channel.send(top10Data);
	}
};
