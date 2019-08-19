const db = require('better-sqlite3')('scores.db');
const sched = require('node-schedule');

function initializeDatabase() {
	// check if table exists
	const table = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='scores';").get();
	if (!table['count(*)']) {
		// if table doesn't exists, create table and setup database
		db
			.prepare(
				'CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, coins INTEGER, isClaimed INTEGER, rollTimes INTEGER);'
			)
			.run();
		// ensure that id row is always unique and indexed
		db.prepare('CREATE UNIQUE INDEX idx_scores_id ON scores (id);').run();
		db.pragma('synchronous = 1');
		db.pragma('journal_mode = wal');
		console.log('database created.');
	}
}

function getDatabase(authId, guildId) {
	const getData = db.prepare('SELECT * FROM scores WHERE user = ? AND guild = ?');
	return getData.get(authId, guildId);
}

function setDatabase(xpObj) {
	const setData = db.prepare(
		'INSERT OR REPLACE INTO scores (id, user, guild, points, level, coins, isClaimed, rollTimes) VALUES (@id, @user, @guild, @points, @level, @coins, @isClaimed, @rollTimes);'
	);
	setData.run(xpObj);
}

function resetDaily() {
	sched.scheduleJob('0 0 * * *', () => {
		db.prepare('UPDATE scores SET isClaimed = 0;').run();
		db.prepare('UPDATE scores SET rollTimes = 0;').run();
	});
}

function setUserData(authId, guildId) {
	const data = {
		id: `${guildId}-${authId}`,
		user: authId,
		guild: guildId,
		points: 0,
		level: 1,
		coins: 0,
		isClaimed: 0,
		rollTimes: 0
	};
	return data;
}

module.exports = {
	initializeDatabase,
	getDatabase,
	setDatabase,
	resetDaily,
	setUserData
};
