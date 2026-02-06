const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  ideaId: String,
  title: String,
  description: String,
  titleImage: { type: String, default: "" },
  relatedProblemId: String,
  stage: { type: Number, default: 1 },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],
  comments: { type: Array, default: [] },
  team: [{
    name: String,
    email: String,
    role: String,
    image: String
  }],
  mentor: String,
  contact: String,
  addedByName: String,
  addedByEmail: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
