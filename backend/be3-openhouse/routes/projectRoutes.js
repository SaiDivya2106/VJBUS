const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const projectController = require('../controllers/projectController');


// Routes for CRUD operations
router.post('/upload-project', upload.fields([
  { name: 'methodology' },
  { name: 'result' },
  { name: 'cover_poster' },
  { name: 'pdf_poster' }
]), projectController.createProject);

router.delete('/:id', projectController.deleteProject);


router.get('/', projectController.getProjects);
router.get('/stats', projectController.getStats);
router.get('/me', projectController.getProjectsByUserName);

router.get('/:id', projectController.getProject);

router.get('/:id/comments-upvotes', projectController.getCommentsAndUpvotes);


router.post('/:id/comments', projectController.addComment);
router.delete('/:id/comment/:commentId', projectController.removeComment);


router.post('/:id/upvote', projectController.upvoteProject);
router.delete('/:id/remove-vote', projectController.removeVote);


module.exports = router;
