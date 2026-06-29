const projectService = require('../services/projectService');
const path = require('path');

const createProject = (req, res) => {
  const { title, abstract, team_details, department, tags, domain, is_software, mentor_name, startup_potential, drive_link, user_name, phone_number } = req.body;  // Added user_name

  const methodology = req.files['methodology'] ? req.files['methodology'][0].filename : null;
  const result = req.files['result'] ? req.files['result'][0].filename : null;
  const cover_poster = req.files['cover_poster'] ? req.files['cover_poster'][0].filename : null;
  const pdf_poster = req.files['pdf_poster'] ? req.files['pdf_poster'][0].filename : null;

  const projectData = { title, abstract, team_details, department, tags, domain, is_software, mentor_name, startup_potential, drive_link, user_name, phone_number };  // Added user_name
  const fileData = { methodology, result, cover_poster, pdf_poster };

  projectService.addProject(projectData, fileData, (err, projectId) => {
    if (err) {
      return res.status(500).send('Error saving project data');
    }
    res.status(200).json({ id: projectId, ...projectData, methodologyUrl: `/uploads/${methodology}`, resultUrl: `/uploads/${result}`, coverPosterUrl: `/uploads/${cover_poster}`, pdfPosterUrl: `/uploads/${pdf_poster}` });
  });
};


// Add a comment to a project
const addComment = async (req, res) => {
  const { id } = req.params;  // Extract project ID from the URL
  const { user_name, comment_text } = req.body;

  // Validate required fields
  if (!id || !user_name || !comment_text) {
    return res.status(400).json({ error: "Project ID, user name, and comment text are required" });
  }

  try {
    console.log('Validating data and preparing to add comment...');

    // Call the service to add the comment to the project
    const result = await projectService.addComment(id, user_name, comment_text);  // Await the result from the service

    console.log("Comment added successfully");

    // Respond with a success message
    res.status(200).json({ message: result });
  } catch (err) {
    console.error("Error processing comment job:", err);
    res.status(500).json({ error: "Error processing comment job" });
  }
};

// Get projects with pagination and filtering
const getProjects = (req, res) => {
  const { page, limit, tags, department } = req.query;
  const options = { page, limit, tags, department };

  console.log("Fetching projects with options:", options);

  projectService.getAllProjects(options, (err, result) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).send('Error fetching projects');
    }
    res.status(200).json(result);
  });
};

// Get project by ID
const getProject = (req, res) => {
  const { id } = req.params;
  projectService.getProjectById(id, (err, project) => {
    if (err) {
      return res.status(500).send('Error fetching project');
    }
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json(project);
  });
};


const extractUsernameFromCookie = (req) => {
  // Get the 'user' cookie from the request headers
  const cookies = req.headers.cookie;

  // If cookies are not available, return null or handle it as needed
  if (!cookies) {
    return null;
  }

  // Split the cookie string into individual cookies
  const cookiesArray = cookies.split(';');

  // Find the 'user' cookie
  const userCookie = cookiesArray.find(cookie => cookie.trim().startsWith('user='));

  if (!userCookie) {
    return null;
  }

  // Get the value of the 'user' cookie (after 'user=')
  const userCookieValue = userCookie.split('=')[1];

  // Decode the URL-encoded string
  const decodedUser = decodeURIComponent(userCookieValue);

  // Parse the decoded string as JSON to access the user data
  try {
    const userData = JSON.parse(decodedUser);

    // Extract the part before '@' in the email
    const username = userData.email.split('@')[0]; // Split the email at '@' and take the first part

    return username;
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
};

const getProjectsByUserName = (req, res) => {
  const username = extractUsernameFromCookie(req);

  projectService.getProjectByUser(username, (err, projects) => {
    if (err) {
      return res.status(500).send('Error fetching projects for the user');
    }
    res.status(200).json(projects);
  });
};



// Upvote or remove vote from a project
const upvoteProject = async (req, res) => {
  const { id } = req.params;  // Extract project ID from the URL

  console.log("During Upvote", req.body);
  const { user_name } = req.body;  // Extract the user_name (or user_id) from the request body

  if (!id || !user_name) {
    return res.status(400).json({ error: "Project ID and user name are required" });
  }

  try {
    console.log('Validating data and preparing to upvote/remove vote from project...');

    // Call the service to upvote the project or remove vote if already upvoted
    const result = await projectService.upvoteProject(id, user_name);  // Await the result from the service

    console.log("Upvote successful or vote removed");

    // Respond with a success message
    res.status(200).json({ message: result });
  } catch (err) {
    console.error("Error processing upvote/remove vote job:", err);
    res.status(500).json({ error: "Error processing upvote/remove vote job" });
  }
};


// Delete Project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project by ID and remove it from the database
    const project = await projectService.deleteProjectById(id);

    // If the project was not found
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If the project was deleted successfully
    return res.status(200).json({ message: 'Project successfully deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while deleting the project' });
  }
};

// Remove vote from a project
const removeVote = async (req, res) => {
  const { id } = req.params;  // Extract the project ID from the URL
  const { user_name } = req.body;  // Extract the user_name from the request body

  if (!id || !user_name) {
    return res.status(400).json({ error: "Project ID and user name are required" });
  }

  try {
    console.log('Validating data and preparing to remove vote...');

    // Call the service to remove the vote from the project
    const result = await projectService.removeVote(id, user_name);

    console.log("Vote removed successfully");

    // Respond with a success message
    res.status(200).json({ message: result });
  } catch (err) {
    console.error("Error processing remove vote job:", err);
    res.status(500).json({ error: "Error processing remove vote job" });
  }
};


// Remove a comment from a project by comment ID and user_name
const removeComment = async (req, res) => {
  const { commentId } = req.params;  // Extract the comment ID from the URL
  const { user_name } = req.body;  // Extract the user_name from the request body

  // Validate that both comment ID and user name are provided
  if (!commentId || !user_name) {
    return res.status(400).json({ error: "Comment ID and user name are required" });
  }

  try {
    console.log('Validating data and preparing to remove comment...');

    // Call the service to remove the comment by ID and user name
    const result = await projectService.removeComment(commentId, user_name);  // Await the result from the service

    console.log("Comment removed successfully");

    // Respond with a success message
    res.status(200).json({ message: result });
  } catch (err) {
    console.error("Error processing remove comment job:", err);
    res.status(500).json({ error: "Error processing remove comment job" });
  }
};


// Get all comments and upvotes for a project
const getCommentsAndUpvotes = async (req, res) => {
  const { id } = req.params;  // Extract the project ID from the URL

  if (!id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    console.log('Fetching comments and upvotes for project ID:', id);

    // Call the service to get comments and upvotes
    const result = await projectService.getProjectCommentsAndUpvotes(id);

    console.log("Fetched comments and upvotes successfully");

    // Respond with the comments and upvotes
    res.status(200).json({ comments: result.comments, upvotes: result.upvotes });
  } catch (err) {
    console.error("Error processing get comments and upvotes job:", err);
    res.status(500).json({ error: "Error fetching comments and upvotes" });
  }
};



const getStats = async (req, res) => {
  try {
    const stats = await projectService.getProjectStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Error fetching stats' });
  }
};


module.exports = {
  createProject,
  getProjects,
  getProject,
  getProjectsByUserName,
  addComment,
  upvoteProject,
  deleteProject,
  removeVote,
  removeComment,
  getCommentsAndUpvotes,
  getStats
};
