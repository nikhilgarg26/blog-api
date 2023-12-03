const express = require('express')
const router = express.Router()
const multer = require('multer')
const Blog = require('../models/blog')
const Comment = require('../models/comments')


//Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/blogcover')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        req.file = name
        cb(null, name)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.post('/new', upload.single('coverfile'), async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        coverImage: req.file.filename,
        createdBy: req.user._id
    })

    await blog.save()
    res.redirect(`/${blog._id}`)
})

router.get('/:id', async (req,res)=>{
    const blogId = req.params.id
    const blog = await Blog.findById(blogId).populate('createdBy')

    const comments = await Comment.find({blogId}).populate('createdBy')
    
    return res.render("blog",{
        user: req.user,
        blog: blog,
        comments,
    })
})

router.post('/comment/:blogId', async(req,res)=>{
    const comment = new Comment({
        content: req.body.content,
        createdBy: req.user._id,
        blogId: req.params.blogId,
    })

    await comment.save()

    return res.redirect(`/blog/${req.params.blogId}`)

})

module.exports = router