const express = require('express')
const { requireSignIn } = require('../controllers/userController')
const { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController } = require('../controllers/postController')
const router = express.Router()

router.post('/createPost', requireSignIn, createPostController);
router.get('/getAllPosts', getAllPostsController);
router.get('/getUserPosts', requireSignIn, getUserPostsController);
router.delete('/deletePost/:id', requireSignIn, deletePostController);
router.put('/updatePost/:id', requireSignIn, updatePostController);

module.exports = router
