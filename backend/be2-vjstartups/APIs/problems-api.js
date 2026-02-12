const express = require("express");
const router = express.Router();
const Problem = require("../models/Problems");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// -------------------- MULTER (memory storage) --------------------
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// -------------------- Cloudinary Config --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: promisify cloudinary upload_stream
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "problems" }, // Folder in Cloudinary
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// -------------------- ROUTES --------------------
router.post("/problem", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      briefparagraph,
      description,
      marketSize,
      existingSolutions,
      currentGaps,
      targetCustomers,
      background,
      scalability,
      addedByName,
      addedByEmail,
      tags,
    } = req.body;

    let imageUrl = null;

    // If image uploaded → send to Cloudinary
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Count existing problems for problemId
    const count = await Problem.countDocuments();

    // Ensure tags is always an array
    const formattedTags = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

    // Create problem
    const problem = new Problem({
      problemId: (count + 1).toString(),
      title,
      briefparagraph,
      description,
      marketSize,
      existingSolutions,
      currentGaps,
      targetCustomers,
      image: imageUrl,
      upvotes: 0,
      comments: [],
      background,
      scalability,
      addedByName,
      addedByEmail,
      tags: formattedTags,
      createdAt: new Date(),
    });

    await problem.save();
    res.status(201).json(problem);

  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Problem creation failed" });
  }
});

// ✅ Get all problems
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Failed to fetch problems" });
  }
});

// ✅ Get a single problem by problemId
router.get("/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Failed to fetch problem" });
  }
});

// ✅ Delete a single problem by problemId
// router.delete("/problems/:id", async (req, res) => {
//   try {
//     const deletedProblem = await Problem.findOneAndDelete({ problemId: req.params.id });

//     if (!deletedProblem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     res.status(200).json({ message: "Problem deleted successfully", problem: deletedProblem });
//   } catch (error) {
//     console.error("Error deleting problem:", error);
//     res.status(500).json({ message: "Failed to delete problem" });
//   }
// });


// ✅ Toggle Upvote a problem
router.post("/problem/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body; // user email coming from frontend

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const problem = await Problem.findOne({ problemId: id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user already upvoted
    const alreadyUpvoted = problem.upvotedBy.includes(email);

    if (alreadyUpvoted) {
      // Remove upvote
      problem.upvotedBy = problem.upvotedBy.filter((user) => user !== email);
      problem.upvotes -= 1;
    } else {
      // Add upvote
      problem.upvotedBy.push(email);
      problem.upvotes += 1;
    }

    await problem.save();

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ message: "Failed to toggle upvote" });
  }
});


// ✅ Add a comment to a problem
router.post("/problem/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, name, email } = req.body;

    if (!comment || !name || !email) {
      return res.status(400).json({ message: "Comment, name, and email are required" });
    }

    const newComment = {
      commentId: Date.now().toString(), // generate unique ID using current timestamp
      text: comment,
      name,
      email,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const problem = await Problem.findOneAndUpdate(
      { problemId: id },
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error commenting on problem:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});


// GET /problem-api/problem/:id/comments
router.get("/problem/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOne({ problemId: id });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ comments: problem.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// POST /problem-api/problem/:id/comment/:commentId/reply
router.post("/problem/:id/comment/:commentId/reply", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { reply, name, email } = req.body;

    if (!reply || !name || !email) {
      return res.status(400).json({ message: "Reply, name, and email are required" });
    }

    const newReply = {
      replyId: Date.now().toString(),
      text: reply,
      name,
      email,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
    };

    const problem = await Problem.findOneAndUpdate(
      { problemId: id, "comments.commentId": commentId },
      { $push: { "comments.$.replies": newReply } },
      { new: true }
    );

    if (!problem) return res.status(404).json({ message: "Problem or comment not found" });

// Return all comments of the problem
res.status(200).json({ comments: problem.comments });


  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: "Failed to add reply" });
  }
});



// POST /problem-api/problem/:id/comment/:commentId/like
router.post("/problem/:id/comment/:commentId/like", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { email, replyId } = req.body; // if replyId exists, like a reply

    const problem = await Problem.findOne({ problemId: id });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (replyId) {
      // Like/unlike a reply
      const comment = problem.comments.find(c => c.commentId === commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      const reply = comment.replies.find(r => r.replyId === replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });

      reply.likedBy = reply.likedBy || [];

      if (reply.likedBy.includes(email)) {
        // Unlike
        reply.likedBy = reply.likedBy.filter(e => e !== email);
      } else {
        // Like
        reply.likedBy.push(email);
      }

      // Update likes count based on length of likedBy array
      reply.likes = reply.likedBy.length;

    } else {
      // Like/unlike a comment
      const comment = problem.comments.find(c => c.commentId === commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      comment.likedBy = comment.likedBy || [];

      if (comment.likedBy.includes(email)) {
        // Unlike
        comment.likedBy = comment.likedBy.filter(e => e !== email);
      } else {
        // Like
        comment.likedBy.push(email);
      }

      // Update likes count based on length of likedBy array
      comment.likes = comment.likedBy.length;
    }

    await problem.save();
    res.status(200).json(problem);
  } catch (err) {
    console.error("Error liking comment/reply:", err);
    res.status(500).json({ message: "Failed to like comment/reply" });
  }
});

// ✅ Delete a single problem by problemId (only owner can delete)
// ✅ Delete a single problem by problemId (only owner can delete)
router.delete("/problems/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params;
    const { email } = req.body; // email from request body

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the problem (problemId is stored as string in DB)
    const problem = await Problem.findOne({ problemId: problemId });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Ownership check
    if (problem.addedByEmail !== email) {
      return res.status(403).json({ message: "You are not allowed to delete this problem" });
    }

    // Delete problem
    await Problem.deleteOne({ problemId: problemId });

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// ✅ Update a problem by problemId (only owner can update)
router.put("/problems/:id/:email", upload.single("image"), async (req, res) => {
  try {
    const { id, email } = req.params; // email comes from route now

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const problem = await Problem.findOne({ problemId: id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.addedByEmail !== email) {
      return res.status(403).json({ message: "You are not allowed to edit this problem" });
    }

    // Handle image upload if provided
    let imageUrl = problem.image;
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Update fields
    const updatedData = {
      title: req.body.title || problem.title,
      briefparagraph: req.body.briefparagraph || problem.briefparagraph,
      description: req.body.description || problem.description,
      marketSize: req.body.marketSize || problem.marketSize,
      existingSolutions: req.body.existingSolutions || problem.existingSolutions,
      currentGaps: req.body.currentGaps || problem.currentGaps,
      targetCustomers: req.body.targetCustomers || problem.targetCustomers,
      background: req.body.background || problem.background,
      scalability: req.body.scalability || problem.scalability,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : problem.tags,
      image: imageUrl
    };

    const updatedProblem = await Problem.findOneAndUpdate(
      { problemId: id },
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: "Failed to update problem" });
  }
});


module.exports = router;
