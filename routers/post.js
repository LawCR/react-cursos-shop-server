const { Router } = require('express')
const { addPost, getPosts, updatePost, deletePost, getPost } = require('../controllers/post')
const { ensureAuth } = require('../middleware/authenticated')
const router = Router()

router.post("/add-post", [ensureAuth], addPost)

router.get('/get-posts', getPosts)

router.put('/update-post/:id', [ensureAuth], updatePost)

router.delete('/delete-post/:id', [ensureAuth], deletePost)

router.get('/get-post/:url', getPost)


module.exports = router