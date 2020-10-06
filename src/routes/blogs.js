const router = require("express").Router()
const Blog = require("./../models/blog")
const auth = require("./../middleware/auth")

//<---- BlogPosts route ---->

//create blog

router.get("/blogPost/new", auth, async (req, res) => {
    try{
        res.render("./blogs/new");
    } catch(e){
        res.redirect("back")
    }
})

router.post("/blogPost", auth, async (req, res) => {
    try{
        if(!req.body.blog.imagesrc){
            delete req.body.blog.imagesrc
        }

        const blog = new Blog({
            ...req.body.blog,
            author: req.user._id
        })

        await blog.save()

        res.redirect("/blogPost/" + blog._id);
    } catch(e){
        res.redirect("back")
    }
})

//read blog

router.get("/blogPost/:id", async (req, res) => {  
    try{
        const blog = await Blog.findById(req.params.id)

        if(!blog){
            throw new Error()
        }

        await blog.populate("author", "username").execPopulate()

        res.render("./blogs/blog", {blog})
    } catch(e){
        res.redirect("back");
    }
})

//update blog

router.get("/blogPost/:id/edit", auth, async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id)
        
        if(!blog){
            throw new Error()
        }

        if(!req.user._id.equals(blog.author)){
            throw new Error()
        }        

        res.render("./blogs/editBlog", {blog})
    } catch(e){
        res.redirect("back")
    }
})

router.put("/blogPost/:id", auth, async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id)

        if(!blog){
            throw new Error()
        }

        if(!req.user._id.equals(blog.author)){
            throw new Error()
        }

        const updates = Object.keys(req.body.blog)
        const allowedUpdates = ["title", "content", "imagesrc"]

        const check = updates.every((update) => allowedUpdates.includes(update))

        if(!check){
            throw new Error()
        }

        updates.every((update) => blog[update] = req.body.blog[update])

        await blog.save()

        res.redirect("/blogPost/" + req.params.id)
    } catch(e){
        res.redirect("/blogPost/" + req.params.id)
    }
})

//delete a blog

router.delete("/blogPost/:id/delete", auth, async (req, res) => {
    try{
        const blog = await Blog.findOne({_id: req.params.id, author: req.user._id});

        if(!blog){
            throw new Error()
        }

        await blog.remove()

        res.redirect("/user")
    }catch(e){
        res.redirect("/user")
    }
})


module.exports = router