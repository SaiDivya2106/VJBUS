const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Idea = require('../models/Ideas');
const Problem = require('../models/Problems');
const upload = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');

router.use(express.json());

// Get all ideas
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ideas", error: err.message });
  }
});

// Get ideas related to a specific problem
router.get('/ideas/problem/:problemId', async (req, res) => {
  try {
    const ideas = await Idea.find({ relatedProblemId: req.params.problemId });
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ideas for this problem", error: err.message });
  }
});

// Get a specific idea
router.get('/ideas/:ideaId', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching idea", error: err.message });
  }
});

// Create new idea
router.post('/idea', upload.fields([
  { name: 'titleImage', maxCount: 1 },
  { name: 'teamImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      title,
      description,
      relatedProblemId,
      stage,
      mentor,
      contact,
      addedByName,
      addedByEmail,
      team
    } = req.body;

    // Parse team members if sent as string
    let teamMembers = team;
    if (typeof team === 'string') {
      try {
        teamMembers = JSON.parse(team);
      } catch (error) {
        teamMembers = [];
      }
    }

    // Upload title image if provided
    let titleImageUrl = '';
    if (req.files && req.files.titleImage && req.files.titleImage[0]) {
      const file = req.files.titleImage[0];
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'idea_images',
          resource_type: 'auto'
        });
        titleImageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
      }
    }
    
    // Create a new idea
    const newIdea = new Idea({
      ideaId: uuidv4(),
      title,
      description,
      titleImage: titleImageUrl,
      relatedProblemId,
      stage: parseInt(stage) || 1,
      mentor,
      contact,
      team: teamMembers,
      upvotes: 0,
      upvotedBy: [],
      comments: [],
      addedByName,
      addedByEmail,
      tags: [],
      createdAt: new Date()
    });

    await newIdea.save();
    res.status(201).json(newIdea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating idea", error: err.message });
  }
});

// Update idea
router.put('/idea/:ideaId', upload.array('teamImages'), async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the creator of the idea
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to update this idea" });
    }

    // Update idea fields
    idea.title = req.body.title || idea.title;
    idea.description = req.body.description || idea.description;
    idea.relatedProblemId = req.body.relatedProblemId || idea.relatedProblemId;
    idea.stage = req.body.stage ? parseInt(req.body.stage) : idea.stage;
    idea.mentor = req.body.mentor || idea.mentor;
    idea.contact = req.body.contact || idea.contact;

    // Update team if provided
    if (req.body.team) {
      let teamMembers = req.body.team;
      if (typeof req.body.team === 'string') {
        try {
          teamMembers = JSON.parse(req.body.team);
        } catch (error) {
          teamMembers = idea.team; // Keep existing team if parsing fails
        }
      }
      idea.team = teamMembers;
    }

    await idea.save();
    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating idea", error: err.message });
  }
});

// Delete idea
router.delete('/idea/:ideaId', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the creator of the idea
    if (idea.addedByEmail !== req.body.email) {
      return res.status(403).json({ message: "Unauthorized to delete this idea" });
    }

    await Idea.deleteOne({ ideaId: req.params.ideaId });
    res.json({ message: "Idea deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting idea", error: err.message });
  }
});

// Upvote an idea
router.post('/idea/:ideaId/upvote', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Toggle upvote
    const hasUpvoted = idea.upvotedBy.includes(userEmail);
    
    if (hasUpvoted) {
      // Remove upvote
      idea.upvotedBy = idea.upvotedBy.filter(email => email !== userEmail);
      idea.upvotes = Math.max(0, idea.upvotes - 1);
    } else {
      // Add upvote
      idea.upvotedBy.push(userEmail);
      idea.upvotes += 1;
    }

    await idea.save();
    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error upvoting idea", error: err.message });
  }
});

// Add comment to an idea
router.post('/idea/:ideaId/comment', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const { comment, name, email } = req.body;
    
    if (!comment || !name || !email) {
      return res.status(400).json({ message: "Comment, name, and email are required" });
    }

    const newComment = {
      _id: uuidv4(),
      author: user.name || user.email,
      content: comment,
      email: user.email,
      createdAt: new Date(),
      likes: [],
      replies: []
    };

    idea.comments.push(newComment);
    await idea.save();

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Get all comments for an idea
router.get('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    res.json(idea.comments || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});

// Add a comment to an idea
router.post('/ideas/:ideaId/comments', async (req, res) => {
  try {
    const { author, content, email } = req.body;
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const newComment = {
      _id: uuidv4(),
      author,
      content,
      email,
      createdAt: new Date(),
      likes: [],
      replies: []
    };
    
    idea.comments.push(newComment);
    await idea.save();
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Like a comment
router.post('/ideas/:ideaId/comments/:commentId/like', async (req, res) => {
  try {
    const { email } = req.body;
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const comment = idea.comments.find(c => c._id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Toggle like
    if (!comment.likes) comment.likes = [];
    
    const likeIndex = comment.likes.indexOf(email);
    if (likeIndex > -1) {
      // Remove like
      comment.likes.splice(likeIndex, 1);
    } else {
      // Add like
      comment.likes.push(email);
    }
    
    await idea.save();
    
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking comment", error: err.message });
  }
});

// Add a reply to a comment
router.post('/ideas/:ideaId/comments/:commentId/replies', async (req, res) => {
  try {
    const { author, content, email } = req.body;
    
    const idea = await Idea.findOne({ ideaId: req.params.ideaId });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    
    const comment = idea.comments.find(c => c._id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    const newReply = {
      _id: uuidv4(),
      author,
      content,
      email,
      createdAt: new Date(),
      likes: []
    };
    
    if (!comment.replies) comment.replies = [];
    comment.replies.push(newReply);
    
    await idea.save();
    
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding reply", error: err.message });
  }
});

module.exports = router;
