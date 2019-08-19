const db = require('better-sqlite3')('scores.db');
const sched = require('node-schedule');

function initializeDatabase() {
	// check if table exists
	const table = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='scores';").get();
	if (!table['count(*)']) {
		// if table doesn't exists, create table and setup database
		db
			.prepare(
				'CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, coins INTEGER);'
			)
			.run();
		// ensure that id row is always unique and indexed
		db.prepare('CREATE UNIQUE INDEX idx_scores_id ON scores (id);').run();
		db.pragma('synchronous = 1');
		db.pragma('journal_mode = wal');
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
		db.preprare('UPDATE score SET isClaimed=0 WHERE isClaimed=1').run();
		console.log('Daily Rewards are ready!');
	});
}

module.exports = { initializeDatabase, getDatabase, setDatabase, resetDaily };
