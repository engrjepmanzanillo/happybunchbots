module.exports = {
	name: 'roll',
	description: 'roll dice. (under development: leaderboards, coin system)',
	aliases: [ 'dice' ],
	cooldown: 5,
	execute(message, args) {
		const channel = message.guild.channels.find((ch) => ch.name === 'games-and-fun');
		if (!channel) return;
		if (message.channel.name !== 'games-and-fun') {
			message.delete(0);
			channel.send(`Please play here <@${message.author.id}>`);
			return;
		}
		if (!args.length) {
			let randomNum = Math.floor(Math.random() * 24 + 1);
			message.reply(`You rolled ${randomNum}.`);
		} else {
			message.reply("I didn't quite get your command. Type `%help roll` to get info.");
		}
	}
};
