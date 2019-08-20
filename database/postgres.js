require('dotenv').config();
const { Client } = require('pg');
const connectionString = process.env.CONNECTION_STRING;

const client = new Client({
	connectionString: connectionString
});

const connectDatabase = () => {
	client.connect((err) => {
		if (err) throw err;
		console.log('connected to database...');
	});
};

const getDatabase = (authId, guildId) => {
	const data = client.query('SELECT * FROM scores WHERE "user" = $1 AND guild = $2;', [ authId, guildId ], (err) => {
		if (err) throw err;
	});
	return data;
};

const setDatabase = (dataObject) => {
	client.query(
		'INSERT INTO scores (id, "user", guild, points, level, coins, "isClaimed", "rollTimes") VALUES ($id, $user, $points, $level, $coins, $isClaimed, $rollTimes);',
		[
			dataObject.id,
			dataObject.user,
			dataObject.guild,
			dataObject.points,
			dataObject.level,
			dataObject.coins,
			dataObject.isClaimed,
			dataObject.rollTimes
		],
		(err) => {
			if (err) {
				console.log(err.stack);
			}
		}
	);
};

const setUserData = (authId, guildId) => {
	const userData = [
		{
			id: `${guildId}-${authId}`,
			user: authId,
			guild: guildId,
			points: 0,
			level: 1,
			coins: 0,
			isClaimed: false,
			rollTimes: 0
		}
	];
	return userData;
};

module.exports = {
	connectDatabase,
	getDatabase,
	setDatabase,
	setUserData
};
