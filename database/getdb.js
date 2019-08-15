const db = require('better-sqlite3')('scores.db');

function getDatabase(authId, guildId) {
	const getData = db.prepare('SELECT * FROM scores WHERE user = ? AND guild = ?');
	return getData.get(authId, guildId);
}

module.exports = getDatabase;
