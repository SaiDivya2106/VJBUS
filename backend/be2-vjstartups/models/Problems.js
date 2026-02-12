const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemId: String,
  title: String,
  briefparagraph: String,
  description: String,   // added
  marketSize: String,    // added
  existingSolutions: String,  // added (comma separated solutions)
  currentGaps: String,   // added
  targetCustomers: String,   // added
  image: String,
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],
  comments: { type: Array, default: [] },
  background: String,
  scalability: String,
  addedByName: String,
  addedByEmail: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
