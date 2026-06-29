const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./projects.db');

db.serialize(() => {
    // Add upload_date column if not exists
    db.run(`ALTER TABLE projects ADD COLUMN upload_date DATE`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('upload_date column already exists.');
            } else {
                console.error('Error adding upload_date column:', err.message);
            }
        } else {
            console.log('Added upload_date column.');
        }
    });

    // Seed old projects with '2025-04-25'
    db.run(`UPDATE projects SET upload_date = '2025-04-25' WHERE upload_date IS NULL`, (err) => {
        if (err) {
            console.error('Error seeding upload_date:', err.message);
        } else {
            console.log('Seeded upload_date for old projects.');
        }
    });
});

db.close();
