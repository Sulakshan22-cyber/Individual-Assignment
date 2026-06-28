require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

function requireAuth(req, res, next) {
    if (req.session.loggedIn) next();
    else res.redirect('/');
}

function requireAdmin(req, res, next) {
    if (req.session.loggedIn && req.session.role === 'admin') next();
    else res.redirect('/dashboard');
}

function requireStudent(req, res, next) {
    if (req.session.loggedIn && req.session.role === 'student') next();
    else res.redirect('/dashboard');
}

app.get('/', (req, res) => {
    if (req.session.loggedIn) return res.redirect('/dashboard');
    res.render('index', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return console.error(err.message);
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedIn = true;
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            return res.redirect('/dashboard');
        }
        res.render('index', { error: 'Invalid username or password!' });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.get('/dashboard', requireAuth, (req, res) => {
    if (req.session.role === 'admin') return res.redirect('/admin');
    return res.redirect('/student');
});

app.get('/admin', requireAdmin, (req, res) => {
    const positions = ['President', 'Vice President', 'Secretary'];
    db.get('SELECT COUNT(*) as total FROM users WHERE role = "student"', [], (err, totalRow) => {
        db.get('SELECT COUNT(DISTINCT user_id) as voted FROM votes', [], (err2, votedRow) => {
            const total = totalRow.total;
            const voted = votedRow.voted;
            const participation = total > 0 ? Math.round((voted / total) * 100) : 0;
            db.all(`
                SELECT c.id, c.name, c.position, COUNT(v.id) as voteCount
                FROM candidates c
                LEFT JOIN votes v ON c.id = v.candidate_id
                GROUP BY c.id
                ORDER BY c.position, voteCount DESC
            `, [], (err3, candidates) => {
                const results = {};
                positions.forEach(p => {
                    results[p] = candidates.filter(c => c.position === p);
                });
                const leading = [...candidates].sort((a, b) => b.voteCount - a.voteCount)[0];
                res.render('admin', {
                    username: req.session.username,
                    results,
                    positions,
                    total,
                    voted,
                    participation,
                    leading
                });
            });
        });
    });
});

app.get('/student', requireStudent, (req, res) => {
    const userId = req.session.userId;
    const positions = ['President', 'Vice President', 'Secretary'];
    db.get('SELECT has_voted FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.redirect('/');
        db.all('SELECT * FROM candidates ORDER BY position', [], (err2, candidates) => {
            const grouped = {};
            positions.forEach(p => {
                grouped[p] = candidates.filter(c => c.position === p);
            });
            res.render('student', {
                username: req.session.username,
                grouped,
                positions,
                hasVoted: user.has_voted === 1
            });
        });
    });
});

app.post('/vote', requireStudent, (req, res) => {
    const userId = req.session.userId;
    db.get('SELECT has_voted FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.redirect('/');
        if (user.has_voted === 1) return res.redirect('/student');
        const positions = ['President', 'Vice President', 'Secretary'];
        const votes = [];
        positions.forEach(pos => {
            const key = pos.replace(' ', '_');
            const candidateId = req.body[key];
            if (candidateId) {
                votes.push({ candidateId, pos });
            }
        });
        if (votes.length === 0) return res.redirect('/student');
        let completed = 0;
        votes.forEach(({ candidateId, pos }) => {
            db.run(
                `INSERT INTO votes (user_id, candidate_id, position) VALUES (?, ?, ?)`,
                [userId, candidateId, pos],
                () => {
                    completed++;
                    if (completed === votes.length) {
                        db.run(`UPDATE users SET has_voted = 1 WHERE id = ?`, [userId], () => {
                            console.log(`[SYSTEM] '${req.session.username}' submitted their vote.`);
                            res.redirect('/student');
                        });
                    }
                }
            );
        });
    });
});

app.use((req, res) => res.redirect('/'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
