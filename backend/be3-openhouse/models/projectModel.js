const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database connection
const db = new sqlite3.Database('./projects.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create tables if they don't exist, with error handling
const createTables = () => {
  db.run(`
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  title TEXT NOT NULL, 
  abstract TEXT NOT NULL, 
  team_details TEXT NOT NULL, 
  department TEXT NOT NULL, 
  tags TEXT NOT NULL, 
  domain TEXT NOT NULL, 
  is_software BOOLEAN NOT NULL, 
  methodology TEXT, 
  result TEXT, 
  cover_poster TEXT, 
  pdf_poster TEXT, 
  mentor_name TEXT,  
  startup_potential TEXT, 
  drive_link TEXT, 
  user_name TEXT, 
  phone_number TEXT, 
  comments_count INTEGER DEFAULT 0, 
  votes_count INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error("Error creating projects table:", err.message);
    } else {
      console.log("Projects table created or already exists.");
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      comment_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating comments table:", err.message);
    } else {
      console.log("Comments table created or already exists.");
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      vote_type TEXT CHECK(vote_type IN ('upvote', 'downvote')) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating votes table:", err.message);
    } else {
      console.log("Votes table created or already exists.");
    }
  });
};

// Create tables when the script is executed
createTables();
console.log("Creating tables required.")

// Export the database connection
module.exports = db;
