# paste the entire content here
# 🏛️ SRC Election Portal

ECB4233 / SCB2154 — Server-Side Programming
Individual Assignment 
MILA University, School of Engineering and Computing



Name: Sulakshan Mahendran
Student ID: 1106232003




 (Table of Contents)

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Installation & Setup](#-installation--setup)
- [How to Use](#-how-to-use)
- [Login Credentials](#-login-credentials)
- [Screenshots](#-screenshots)
- [Security Features](#-security-features)
- [Audit Trail](#-audit-trail)



(Project Overview)

The SRC Election Portal is a full-stack web application built for the Student Representative Council (SRC) election at MILA University. The system allows students to cast their votes for three election positions — President, Vice President, and Secretary — while giving administrators a live dashboard to monitor voting results and participation.

The application is built using Node.js and Express.js with an EJS templating engine, SQLite database, and session-based authentication with Role-Based Access Control (RBAC).



## Features

## Admin Features
- Secure login with hashed password authentication
- Live voting results dashboard with progress bars
- Total students, votes cast and participation percentage statistics
- Leading candidate display with vote count and percentage
- Results grouped by election position (President, Vice President, Secretary)
- Candidates ranked by vote count in real time

### Student Features
- Secure login with hashed password authentication
- View all candidates with profile photos and manifestos
- Vote for one candidate per position (President, Vice President, Secretary)
- One-time voting enforcement — cannot vote again after submitting
- Visual confirmation after vote is submitted
- All vote buttons disabled after voting

### Security Features
- Password hashing using `bcryptjs`
- Session management using `express-session`
- Role-based middleware protecting all routes
- One-vote-per-student enforcement at database level
- Environment variables for secret key management



##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS (Embedded JavaScript) |
| Database | SQLite3 |
| Authentication | bcryptjs, express-session |
| Environment | dotenv |
| Styling | Custom CSS (Purple & Gold theme) |
| Dev Tool | Nodemon |

---

##  Project Structure

```
SRC-Election-Portal/
│
├── public/
│   ├── style.css           # Global CSS styling (Purple & Gold theme)
│   └── images/             # Candidate profile photos
│       ├── vijay.png
│       ├── epstein.png
│       ├── najib.png
│       ├── messi.png
│       ├── ronaldo.png
│       ├── ajith.png
│       ├── srk.png
│       ├── elon.png
│       └── donald.png
│
├── views/
│   ├── index.ejs           # Login page
│   ├── admin.ejs           # Admin dashboard (results view)
│   └── student.ejs         # Student dashboard (voting page)
│
├── database.js             # SQLite database setup and seeding
├── server.js               # Main Express application and routes
├── .env                    # Environment variables (not pushed to GitHub)
├── .gitignore              # Files excluded from Git
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

---

##  Database Design

The application uses **SQLite** with three tables:

### `users` Table
Stores all user accounts including admin and student accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| username | TEXT | Unique username |
| password | TEXT | Bcrypt hashed password |
| role | TEXT | Either `admin` or `student` |
| has_voted | INTEGER | `0` = not voted, `1` = voted |

### `candidates` Table
Stores all election candidates across all positions.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| name | TEXT | Candidate full name |
| manifesto | TEXT | Candidate manifesto / description |
| position | TEXT | `President`, `Vice President`, or `Secretary` |
| avatar | TEXT | Path to candidate profile image |

### `votes` Table
Records each vote cast by a student.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| user_id | INTEGER | ID of the student who voted |
| candidate_id | INTEGER | ID of the candidate voted for |
| position | TEXT | Position the vote was cast for |

---

##  Role-Based Access Control (RBAC)

The application implements three middleware functions to protect routes:

| Middleware | Role Required | Protected Routes |
|------------|--------------|-----------------|
| `requireAuth` | Any logged-in user | `/dashboard` |
| `requireAdmin` | Admin only | `/admin` |
| `requireStudent` | Student only | `/student`, `/vote` |

### How RBAC Works

1. When a user logs in, their **role** is stored in the session (`req.session.role`)
2. Every protected route passes through a middleware function that checks the session role
3. If the role does not match, the user is **redirected** to the appropriate page
4. Admin users are automatically redirected to `/admin` dashboard
5. Student users are automatically redirected to `/student` voting page

```
Login → Check Role in Session
         ├── role === 'admin'   → /admin   (results dashboard)
         └── role === 'student' → /student (voting page)
```

---

##  Installation & Setup

### Prerequisites
- Node.js (v18 or above)
- npm
- Git

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Sulakshan22-cyber/SRC-Election-Portal.git
cd SRC-Election-Portal
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Generate Session Secret Key

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output key.

### Step 4 — Create `.env` File

Create a file named `.env` in the root folder:

```
SESSION_SECRET=your_generated_secret_key_here
```

### Step 5 — Start the Server

```bash
npx nodemon server.js
```

Or with Node directly:

```bash
node server.js
```

### Step 6 — Open in Browser

```
http://localhost:3000
```

---

##  How to Use

### As Admin
1. Go to `http://localhost:3000`
2. Login with username `admin` and password `pass123`
3. View live voting results, participation stats and leading candidate
4. Results update as students vote

### As Student
1. Go to `http://localhost:3000`
2. Login with any student account (see credentials below)
3. View all candidates with their photos and manifestos
4. Select one candidate per position (President, Vice President, Secretary)
5. Click Submit My Vote
6. After voting, all vote buttons are disabled and a confirmation message is shown
7. The vote cannot be changed after submission

---

##  Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | pass123 | Admin |
| alice | pass123 | Student |
| bob | pass123 | Student |
| charlie | pass123 | Student |
| diana | pass123 | Student |
| ethan | pass123 | Student |

---

##  Screenshots

### Login Page
> Clean centered login card with Purple & Gold university theme

### Student Dashboard (Before Voting)
> Candidate cards with profile photos, names, manifestos and Select radio buttons grouped by position

### Student Dashboard (After Voting)
> All vote buttons replaced with "Vote submitted" and green confirmation banner shown

### Admin Dashboard
> Live results with progress bars, vote counts, participation percentage and leading candidate card

---

##  Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | All passwords hashed with `bcryptjs` before storing in database |
| Session management | `express-session` used to maintain login state securely |
| Secret key | Session secret stored in `.env` file, not pushed to GitHub |
| Role enforcement | Middleware functions protect every route based on user role |
| One-vote enforcement | `has_voted` column in database prevents duplicate voting |
| Route protection | Unauthenticated users are redirected to login page |
| Fallback route | Unknown URLs redirect to login page to prevent errors |

---

##  Audit Trail

The system logs all voting actions to the server console:

```
[SYSTEM] 'alice' submitted their vote.
[SYSTEM] 'bob' submitted their vote.
[SYSTEM] 'charlie' submitted their vote.
```

This provides a server-side record of all user actions for accountability purposes.

---

##  Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.x | Web framework |
| ejs | ^3.x | HTML templating engine |
| express-session | ^1.x | Session management |
| bcryptjs | ^2.x | Password hashing |
| sqlite3 | ^5.x | SQLite database driver |
| dotenv | ^16.x | Environment variable management |
| nodemon | ^3.x | Auto-restart during development |

---
<b>OUTPUT 1</b>

(LOG IN PAGE)

<img src="images/image-log in page.png" alt="Description of image" width="300">


<b>OUTPUT 2</b>

(MAIN PAGE)

<img src="images/image-main page 1.png" alt="Description of image" width="300">


<b>OUTPUT 3</b>

<img src="images/image-main page 2.png" alt="Description of image" width="300">

<b>OUTPUT 4</b>

(AFTER DONE VOTING)

<img src="images/image-voting.png" alt="Description of image" width="300">

<b>OUTPUT 5</b>

(ADMIN PAGE)

<img src="images/image-admin 1.png" alt="Description of image" width="300">

<b>OUTPUT 6</b>

<img src="images/image-admin 2.png" alt="Description of image" width="300">

<b>OUTPUT 7</b>

(DATABASE OF PEOPLE WHO HAVE VOTED)

<img src="images/image-system.png" alt="Description of image" width="300">






*Sulakshan Mahendran | 1106232003 | MILA University | JUNE 2026*
