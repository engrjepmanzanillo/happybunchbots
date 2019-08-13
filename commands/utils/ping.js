module.exports = {
	name: 'ping',
	description: 'pinging the bot.',
	execute(message, args) {
		message.channel.send('Pong!');
	}
};
