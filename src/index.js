const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require('path')
const methodOverride = require("method-override")

const blogRoutes = require("./routes/blogs")
const userRoutes = require("./routes/users")
const Blog = require("./models/blog")
const isLoggedIn = require("./middleware/isLoggedIn")

const app = express()
mongoose.connect("mongodb://localhost:27017/blogApp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true})

app.use(express.static(path.join(__dirname, "../public")))
app.use(express.json())
app.use(cookieParser())
app.use(isLoggedIn)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use((req, res, next) => {
    res.locals.TINY_KEY = process.env.TINY_KEY
    next()
})
app.set("view engine", "ejs")

const PORT = process.env.PORT

//Home page
app.get("/", async (req, res) => {
    try{
        const blogs = await Blog.find({}).populate("author", "username")    
        
        res.render('./blogs/home', {blogs})
    } catch(e){
        res.send()
    }
})

app.use("/", blogRoutes)
app.use("/", userRoutes)

app.listen(PORT, () => {
    console.log(`blogapp is listening on port ${PORT}`)
} )

