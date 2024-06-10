const { Router } = require('express');
const { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost } = require('../controllers/PostController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

const router = Router();

router.post('/create', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/categories/:category', getCatPosts);
router.get('/users/:id', getUserPosts);
router.put('/:id', authMiddleware, editPost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
