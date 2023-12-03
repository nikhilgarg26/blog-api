require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require("path")
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')
const { checkAuth } = require("./middlewares/auth")
const Blog = require("./models/blog")
// const Blog = require("./models/blog")

const app = express()
const PORT = process.env.PORT || 8002

//MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log("MongoDB Connected !!"); })
    .catch(console.error)

//Views
app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))

//Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkAuth)
app.use(express.static('public'));

//Routes
app.get("/", async (req, res) => {
    const allblogs = await Blog.find()
    
    res.render('home', {
        user: req.user,
        blogs:allblogs
    })
})

app.use('/user', userRoutes)
app.use('/blog', blogRoutes)

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})