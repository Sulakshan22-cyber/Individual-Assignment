const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {

    // Candidates table
    db.run(`CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        manifesto TEXT,
        position TEXT,
        avatar TEXT
    )`);

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        has_voted INTEGER DEFAULT 0
    )`);

    // Votes table
    db.run(`CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        candidate_id INTEGER,
        position TEXT
    )`);

    const passHash = bcrypt.hashSync('pass123', 10);

    // Admin account
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', ?, 'admin')`, [passHash]);

    // Student accounts
    const students = ['alice', 'bob', 'charlie', 'diana', 'ethan'];
    students.forEach(name => {
        db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, 'student')`, [name, passHash]);
    });

    // President candidates
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Vijay', 'Committed to improving student welfare and enhancing campus facilities.', 'President', '/images/vijay.png')`);
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Jeffrey Epstein', 'Focused on effective communication and ensuring all student voices are heard.', 'President', '/images/epstein.png')`);
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Najib', 'Dedicated to bridging gaps between students and administration, prioritizing mental health.', 'President', '/images/najib.png')`);

    // Vice President candidates
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Messi', 'Passionate about creating inclusive campus events and student engagement.', 'Vice President', '/images/messi.png')`);
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Ronaldo', 'Committed to transparent budgeting and fair resource distribution.', 'Vice President', '/images/ronaldo.png')`);
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Ajith', 'Focused on digital transformation and modernizing student services.', 'Vice President', '/images/ajith.png')`);

    // Secretary candidates
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('SRK', 'Dedicated to maintaining accurate records and improving communication.', 'Secretary', '/images/srk.png')`);
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Elon Musk', 'Focused on streamlining meeting processes and documentation.', 'Secretary', '/images/elon.png')`);
    db.run(`INSERT OR IGNORE INTO candidates (name, manifesto, position, avatar) VALUES
        ('Donald Trump', 'Passionate about keeping students informed and connected.', 'Secretary', '/images/donald.png')`);

});

module.exports = db;