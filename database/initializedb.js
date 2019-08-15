const db = require('better-sqlite3')('scores.db');

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

module.exports = initializeDatabase;
