const Post = require("../models/post");

// Controlador para crear post
const addPost = (req, res) => {
    const body = req.body
    const post = new Post(body)

    post.save( (err, postStored) => {
        if (err) {
            res.status(500).send({code: 500, message: "This post already exists"})
        } else {
            if (!postStored) {
                res.status(400).send({code: 400, message: "The post could not be created"})
            } else {
                res.status(200).send({code: 200, message: "Post created successfully"})
            }
        }
    })
}


// Controlador para obtener Post
const getPosts = (req, res) => {
    const { page = 1, limit = 10 } = req.query
    
    const options = {
        page,
        limit: parseInt(limit),
        sort: { date: "desc"}
    }

    Post.paginate({}, options, (err, postsStored) => {
        if (err) {
            res.status(500).send({code: 500, message: "Server error, try again later"})
        } else {
            if (!postsStored) {
                res.status(404).send({code:404, message: "No post found"})
            } else {
                res.status(200).send({code: 200, posts: postsStored})
            }
        }
    })
}

// Controlador para actualizar Post
const updatePost = (req, res) => {
    const postData = req.body
    const { id } = req.params

    Post.findByIdAndUpdate(id, postData, (err,postUpdated) => {
        if (err) {
            res.status(500).send({code: 500, message: "Server error, try again later"})
        } else {
            if (!postUpdated) {
                res.status(404).send({code: 404, message: "Post not found"})
            } else {
                res.status(200).send({code: 200, message: "Post updated successfully"})
            }
        }
    })
}

// Controlador para eliminar Post
const deletePost = (req, res) => {
    const {id} = req.params
    Post.findByIdAndDelete(id, (err, postDeleted) => {
        if (err) {
            res.status(500).send({code: 500, message: "Server error, try again later"})
        } else {
            if (!postDeleted) {
                res.status(404).send({code: 404, message: "Post not found"})
            } else {
                res.status(200).send({code: 200, message: "Post deleted successfully"})
            }
        }
    })
}

// Controlador para obtener un post especifico
const getPost = (req, res) => {
    const { url } = req.params
    Post.findOne({url}, (err, postStored) => {
        if (err) {
            res.status(500).send({code: 500, message: "Server error, try again later"})
        } else {
            if (!postStored) {
                res.status(404).send({code: 404, message: "Post not found"})
            } else {
                res.status(200).send({code: 200, post: postStored})
            }
        }
    })
}

module.exports = {
    addPost,
    getPosts,
    updatePost,
    deletePost,
    getPost
}