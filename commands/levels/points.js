const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class PointsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'points',
			group: 'levels',
			memberName: 'points',
			description: 'Returns your current exp points and level.',
			guildOnly: true
		});
	}

	run(message, args) {
		if (!args.length) {
			let score;
			let fileName = './data/' + `${message.guild.id}-${message.author.id}.json`;
			if (!fs.existsSync(fileName)) {
				return message.reply(`You currently have 0 points and are level 1!`);
			}
			fs.readFile(fileName, 'utf8', (err, data) => {
				if (err) return;
				score = JSON.parse(data);
				message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
			});
		}
	}
};
