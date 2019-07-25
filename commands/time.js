module.exports = {
	name: 'time',
	description: 'telling time (GMT+8)',
	cooldown: 5,
	execute(message, args) {
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
		message
			.reply(
				`Its now ${currentHour}:${currentMinute}:${currentSecond} ${amPm} (${gameHour}:${currentMinute} ${gameAmPm} - Game Time)`
			)
			.then((sentMessage) => {
				sentMessage.delete(5000);
			});
		message.delete(1000);
	}
};
