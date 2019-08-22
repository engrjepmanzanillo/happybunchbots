require('dotenv').config();
const { Client } = require('pg');
const connectionString = process.env.CONNECTION_STRING;
const sched = require('node-schedule');

const client = new Client({
	connectionString : connectionString
});

const connectDatabase = async () => {
	console.log('Connecting to postgresql database...');
	await client
		.connect()
		.then(console.log('database connected.'))
		.catch((error) => console.error('connection error', error.stack));
};

const getDatabase = async (authId, guildId) => {
	const queryValue = [
		`${guildId}-${authId}`
	];
	let output = await client
		.query('SELECT * FROM scores WHERE id=$1;', queryValue)
		.then((result) => {
			// if no query result exists, return undefined
			if (result.rows.length === 0) return undefined;
			return result.rows[0];
		})
		.catch((error) => console.log(error.stack));
	return await output;
};

const setDatabase = async (authId, guildId) => {
	const userData = {
		id         : `${guildId}-${authId}`,
		user       : authId,
		guild      : guildId,
		points     : 0,
		level      : 1,
		coins      : 0,
		is_claimed : false,
		roll_times : 0
	};
	await client
		.query(
			'INSERT INTO scores (id, discord_user, discord_guild, points, level, coins, is_claimed, roll_times) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
			[
				userData.id,
				userData.user,
				userData.guild,
				userData.points,
				userData.level,
				userData.coins,
				userData.is_claimed,
				userData.roll_times
			]
		)
		.then(console.log(`user data: ${userData.guild}-${userData.user} created.`))
		.catch((error) => console.error(error.stack));
};

const updateDatabase = async (dataObject) => {
	const newValue = [
		dataObject.points,
		dataObject.level,
		dataObject.coins,
		dataObject.is_claimed,
		dataObject.roll_times,
		dataObject.id
	];
	await client
		.query(
			'UPDATE scores SET points = $1, level = $2, coins = $3, is_claimed = $4, roll_times = $5 WHERE id = $6;',
			newValue
		)
		.then()
		.catch((error) => console.log(error.stack));
};

const sortDatabase = async (category) => {
	let output = await client
		.query(`SELECT * FROM scores ORDER BY ${category} DESC LIMIT 10;`)
		.then((result) => {
			return result.rows;
		})
		.catch((error) => console.log(error.stack));
	return await output;
};

const resetDaily = async () => {
	sched.scheduleJob('0 0 * * *', async () => {
		await client
			.query('UPDATE scores SET is_claimed = $1', [
				false
			])
			.then()
			.catch((error) => console.log(error.stack));
	});
};

module.exports = {
	connectDatabase,
	getDatabase,
	setDatabase,
	updateDatabase,
	resetDaily,
	sortDatabase
};
