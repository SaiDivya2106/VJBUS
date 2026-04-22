const db = require('../models/projectModel');


// Insert a new project
const addProject = (projectData, fileData, callback) => {
  const { title, abstract, team_details, department, tags, domain, is_software, mentor_name, startup_potential, drive_link, user_name, phone_number } = projectData;  // Include user_name here
  const { methodology, result, cover_poster, pdf_poster } = fileData;

  console.log('Inserting project with the following details:');
  console.log('Title:', title);
  console.log('Mentor Name:', mentor_name);
  console.log('Startup Potential:', startup_potential);
  console.log('Drive Link:', drive_link);
  console.log('User Name:', user_name);  // Log user_name to verify
  console.log('Methodology File:', methodology);
  console.log('Result File:', result);
  console.log('Cover Poster File:', cover_poster);
  console.log('PDF Poster File:', pdf_poster);
  console.log('Phone number:', phone_number);

  const upload_date = new Date().toISOString().split('T')[0];
  const query = `
    INSERT INTO projects (title, abstract, team_details, department, tags, domain, is_software, methodology, result, cover_poster, pdf_poster, mentor_name, startup_potential, drive_link, user_name, phone_number, upload_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [title, abstract, team_details, department, tags, domain, is_software, methodology, result, cover_poster, pdf_poster, mentor_name, startup_potential, drive_link, user_name, phone_number, upload_date];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error occurred during insert:', err);
      return callback(err);
    }
    callback(null, this.lastID);  // Return the inserted ID
  });
};


// Add comment to a project
const addComment = async (projectId, userName, commentText) => {
  try {
    // Insert the comment into the database (SQLite)
    const query = 'INSERT INTO comments (project_id, user_name, comment_text) VALUES (?, ?, ?)';

    // Return a Promise to ensure async/await works
    await new Promise((resolve, reject) => {
      db.run(query, [projectId, userName, commentText], function (err) {
        if (err) reject(err);
        else resolve(this);  // Resolve on successful insertion
      });
    });

    console.log(`Comment added successfully to project ${projectId}`);
    return 'Comment added successfully';  // Return success message
  } catch (err) {
    console.error('Error adding comment:', err);
    throw new Error('Error adding comment');
  }
};


// Get a project by ID
const getProjectByUser = (id, callback) => {
  db.all('SELECT * FROM projects WHERE user_name = ?', [id], (err, row) => {

    callback(err, row);
  });
};

// Get all projects with filtering and pagination
const getAllProjects = (options, callback) => {
  const { page = 1, limit = 30, tags, department } = options;
  const offset = (page - 1) * limit;

  let whereClauses = [];
  let params = [];

  if (department) {
    whereClauses.push('p.department = ?');
    params.push(department);
  }

  if (tags) {
    // tags is expected to be a string or array
    const tagList = Array.isArray(tags) ? tags : [tags];
    tagList.forEach(tag => {
      whereClauses.push('p.tags LIKE ?');
      params.push(`%${tag}%`);
    });
  }

  const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) as total FROM projects p ${whereStr}`;

  const query = `
    SELECT 
      p.*, 
      (SELECT COUNT(*) FROM comments WHERE project_id = p.id) AS aggr_comment_count,
      (SELECT COUNT(*) FROM votes WHERE project_id = p.id AND vote_type = 'upvote') AS aggr_upvote_count
    FROM projects p
    ${whereStr}
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
  `;

  const queryParams = [...params, parseInt(limit), parseInt(offset)];

  db.get(countQuery, params, (err, countResult) => {
    if (err) return callback(err);

    db.all(query, queryParams, (err, rows) => {
      if (err) return callback(err);
      callback(null, {
        projects: rows,
        total: countResult.total,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    });
  });
};

// Get a project by ID
const getProjectById = (id, callback) => {
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
};

// Update a project by ID// Update a project by ID
const updateProjectById = (id, projectData, fileData, callback) => {
  const { title, abstract, team_details, department, tags, domain, is_software, mentor_name, startup_potential, drive_link } = projectData;
  const { methodology, result, cover_poster, pdf_poster } = fileData;

  const query = `
    UPDATE projects SET
      title = ?, 
      abstract = ?, 
      team_details = ?, 
      department = ?, 
      tags = ?, 
      domain = ?, 
      is_software = ?, 
      methodology = ?, 
      result = ?, 
      cover_poster = ?, 
      pdf_poster = ?, 
      mentor_name = ?,         
      startup_potential = ?,   
      drive_link = ?           
    WHERE id = ?
  `;

  const params = [
    title,
    abstract,
    team_details,
    department,
    tags,
    domain,
    is_software,
    methodology,
    result,
    cover_poster,
    pdf_poster,
    mentor_name,
    startup_potential,
    drive_link,
    id
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error occurred during Update:', err);  // Log error
      return callback(err);  // Pass it to callback
    }
    callback(null, this.lastID);  // On success, pass the last ID
  });
};

// Delete a project by ID using Promises
const deleteProjectById = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('Error occurred during delete:', err);
        return reject(err);  // Reject the promise if an error occurs
      }

      // Resolve the promise with the number of rows affected (this.changes)
      resolve(this.changes);  // this.changes contains the number of rows deleted
    });
  });
};


// Upvote a project
const upvoteProject = async (projectId, userName) => {
  try {
    // Check if the user has already upvoted or removed the vote
    const checkQuery = 'SELECT * FROM votes WHERE project_id = ? AND user_name = ?';
    const rows = await new Promise((resolve, reject) => {
      db.all(checkQuery, [projectId, userName], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (rows.length > 0) {
      // Nothing needs to be done. Already user upvoted. 
      return 'Vote removed successfully';  // Return remove vote message
    } else {
      // If no vote exists, add an upvote for the project
      const insertQuery = 'INSERT INTO votes (project_id, user_name, vote_type) VALUES (?, ?, ?)';
      await new Promise((resolve, reject) => {
        db.run(insertQuery, [projectId, userName, 'upvote'], function (err) {
          if (err) reject(err);
          else resolve(this);
        });
      });

      console.log(`User ${userName} upvoted project ${projectId}`);
      return 'Upvote successful';  // Return upvote success message
    }
  } catch (err) {
    console.error('Error upvoting project:', err);
    throw new Error('Error upvoting project');
  }
};


// Find a project by ID and delete it
const findByIdAndDelete = async (id) => {
  try {
    // Find the project by ID and delete it
    const project = await Project.findByIdAndDelete(id);

    // Return the deleted project, or null if not found
    return project;
  } catch (err) {
    throw new Error('Error deleting the project: ' + err.message);
  }
};

// Remove vote from a project
const removeVote = async (projectId, userName) => {
  try {
    // Assume you have a Vote model where you store votes for each project
    const result = await db.run(
      'DELETE FROM votes WHERE project_id = ? AND user_name = ?',
      [projectId, userName]
    );

    // If no rows were affected, it means the user hasn't voted for the project
    if (result.changes === 0) {
      throw new Error('User has not voted for this project');
    }

    return `Vote removed for project ID: ${projectId} by ${userName}`;
  } catch (err) {
    console.error('Error removing vote:', err);
    throw new Error(err.message || 'An error occurred while removing the vote');
  }
};

// Remove a comment from a project by comment ID and user_name
const removeComment = async (commentId, userName) => {
  try {
    // Check if the comment exists and belongs to the specified user
    const comment = await db.get(
      'SELECT * FROM comments WHERE id = ? AND user_name = ?',
      [commentId, userName]
    );

    // If no comment is found or the user doesn't match, throw an error
    if (!comment) {
      throw new Error('Comment not found or user is not authorized to delete this comment');
    }

    // Proceed with deleting the comment if user is authorized
    const result = await db.run(
      'DELETE FROM comments WHERE id = ? AND user_name = ?',
      [commentId, userName]
    );

    // If no rows were affected, it means the comment was not deleted
    if (result.changes === 0) {
      throw new Error('Error occurred while removing the comment');
    }

    return `Comment with ID: ${commentId} removed successfully by ${userName}`;
  } catch (err) {
    console.error('Error removing comment:', err);
    throw new Error(err.message || 'An error occurred while removing the comment');
  }
};

const getProjectCommentsAndUpvotes = async (projectId) => {
  try {
    let comments = [];
    let upvotes = [];

    // Query to fetch all comments for the project using db.each
    await new Promise((resolve, reject) => {
      db.each(
        'SELECT id, user_name, comment_text, created_at FROM comments WHERE project_id = ? ORDER BY created_at DESC',
        [projectId],
        (err, row) => {
          if (err) reject(err);
          comments.push(row);  // Add each row to the comments array
        },
        (err, count) => {
          if (err) reject(err);
          resolve();  // Resolve when done
        }
      );
    });

    // Query to fetch all upvotes for the project
    await new Promise((resolve, reject) => {
      db.each(
        'SELECT user_name FROM votes WHERE project_id = ? AND vote_type = "upvote"',
        [projectId],
        (err, row) => {
          if (err) reject(err);
          upvotes.push(row);  // Add each row to the upvotes array
        },
        (err, count) => {
          if (err) reject(err);
          resolve();  // Resolve when done
        }
      );
    });

    console.log("Comments", comments);
    console.log("Upvotes", upvotes);

    return { comments, upvotes };
  } catch (err) {
    console.error('Error fetching comments and upvotes:', err);
    throw new Error('An error occurred while fetching comments and upvotes');
  }
};


const getProjectStats = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        department,
        strftime('%Y', upload_date) as year,
        COUNT(*) as count
      FROM projects
      GROUP BY department, year
    `;
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};


module.exports = {
  addProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectByUser,
  addComment,
  upvoteProject,
  removeVote,
  removeComment,
  getProjectCommentsAndUpvotes,
  getProjectStats
};
