module.exports = class TimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time',
			group: 'utils',
			memberName: 'time',
			description: 'replies with the current time.',
			throttling: {
				usages: 1,
				duration: 60
			},
			guildOnly: true
		});
	}

	run(message, args) {
		let date = new Date();
		let currentHour = date.getHours();
		let gameHour = date.getHours() - 1;
		let currentMinute = date.getMinutes();
		let currentSecond = date.getSeconds();
		let amPm = 'AM';
		let gameAmPm = 'AM';
		if (currentMinute < 10) {
			currentMinute = `0${currentMinute}`;
		}
		if (currentSecond < 10) {
			currentSecond = `0${currentSecond}`;
		}
		if (currentHour > 12) {
			currentHour = currentHour - 12;
			amPm = 'PM';
		}
		if (gameHour > 12) {
			gameHour = gameHour - 12;
			gameAmPm = 'PM';
		}
		if (!args.length) {
			message
				.reply(
					`Its now ${currentHour}:${currentMinute}:${currentSecond} ${amPm} (${gameHour}:${currentMinute} ${gameAmPm} - Game Time)`
				)
				.then((sentMessage) => {
					sentMessage.delete(5000);
				});
			message.delete();
		}
	}
};
