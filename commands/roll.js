module.exports = {
	name: 'roll',
	description: 'roll dice. (under development: leaderboards, coin system)',
	aliases: [ 'dice' ],
	cooldown: 5,
	execute(message, args) {
		if (!args.length) {
			let randomNum = Math.floor(Math.random() * 24 + 1);
			message.reply(`You rolled ${randomNum}.`);
		} else {
			message.reply("I didn't quite get your command. Type `%help roll` to get info.");
		}
	}
};
