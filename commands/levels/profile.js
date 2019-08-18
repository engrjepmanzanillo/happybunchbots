const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'levels',
			memberName: 'profile',
			description: 'Returns your current exp points and level profile.',
			guildOnly: true
		});
	}

	run(message, args) {
		const { getDatabase } = require('../../database/db');
		let score;
		const channel = message.guild.channels.find((ch) => ch.name === 'xp-profiles');
		if (!channel) return;
		if (message.channel.name !== 'xp-profiles') {
			message.delete();
			channel.send(`please look up your profile here <@${message.author.id}>`);
			return;
		}
		if (!args.length) {
			score = getDatabase(message.author.id, message.guild.id);
			const basePoints = Math.floor(Math.pow((score.level + 1) / 0.1, 2));
			message.delete();
			const embed = new RichEmbed()
				//set title
				.setTitle(message.author.tag)
				.setColor(0xff0000)
				.setThumbnail(message.author.displayAvatarURL)
				.addBlankField()
				.addField('Experience Points', `${score.points} / ${basePoints}`)
				.addField('Noise Level', score.level)
				.addField('Available Coins', `${score.coins} HappyBunch Coins`);

			message.channel.send(embed);
		}
	}
};
