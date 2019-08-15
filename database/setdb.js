const db = require('better-sqlite3')('scores.db');

function setDatabase(xpObj) {
	const setData = db.prepare(
		'INSERT OR REPLACE INTO scores (id, user, guild, points, level, coins) VALUES (@id, @user, @guild, @points, @level, @coins);'
	);
	setData.run(xpObj);
}

module.exports = setDatabase;
