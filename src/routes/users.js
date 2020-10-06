const express = require("express")
const User = require("./../models/user")
const auth = require("./../middleware/auth")

const router = express.Router({mergeParams: true})

//<------>
//signUp and Login routes
//<------>

router.get("/signUp", async (req, res) => {
    try{
        res.render("./users/signUp");
    } catch(e){
        res.redirect("back");
    }
})

router.post("/signUp", async (req, res) => {
    try{
        const user = await User.create(req.body.user)
        const token = await user.generateAuthToken()

        if(!user){
            return res.redirect("back");
        }

        res.cookie("auth", "Bearer " + token, {httpOnly: true, expires: new Date(Date.now() + 1000000*3600000)  }).redirect("/user")
    } catch(e){
        res.redirect("back");
    }
})

router.get("/login", async (req, res) => {
    try{
        res.render("./users/login");
    } catch(e){
        res.redirect("back");
    }
})

router.post("/login", async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.user.username, req.body.user.password)
        const token = await user.generateAuthToken()
        if(!user){
            return res.redirect("back");
        }

        res.cookie("auth", "Bearer " + token, {httpOnly: true, expires: new Date(Date.now() + 1000000*3600000)  }).redirect("/user")
    } catch(e){
        res.redirect("back")
    }
})

router.get("/user/logout", auth, async (req, res) => {
    try{
        req.user.authtokens = req.user.authtokens.filter((token) => token.token != req.token)

        await req.user.save()

        res.redirect("/")
    } catch(e){
        res.redirect("/")
    }
})

//<------>
//Update User
//<------>

router.get("/user/update", auth, async(req, res) => {
    try{
        res.render("./users/editProfile", {user: req.user})
    } catch(e){
        res.redirect("/user")
    }
})

router.put("/user", auth, async (req, res) => {

    try{
        const updates = Object.keys(req.body.user);
        allowedUpdates = ["password"];

        const check = updates.every((update) => allowedUpdates.includes(update))

        if(!check){
            throw new Error()
        }

        req.user.password = req.body.user["password"]

        await req.user.save()

        res.redirect("/user")
    } catch (e){
        console.log(e)
        res.redirect("/user")
    }
})

//<------>
//read User
//<------>

router.get("/user/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        await user.populate([
            {
                path: "blogs",
                model: "blog",
                populate: {
                    path: "author",
                    model: "user",
                    select: "username"
                }
            }
        ]).execPopulate()

        res.render("./users/user", {user, blogs: user.blogs})
    }catch(e){
        res.redirect("/")
    }
})

router.get("/user", auth, async (req, res) => {

    await req.user.populate([
        {
            path: "blogs",
            model: "blog",
            populate: {
                path: "author",
                model: "user",
                select: "username"
            }
        }
    ]).execPopulate()

    res.render("./users/user", {user: req.user, blogs: req.user.blogs})
})

//<------>
//Delete User
//<------>

router.delete("/user/delete", auth, async (req, res) => {
    try{
        const user = await req.user.remove()
        
        res.redirect("/")
    } catch (e){
        res.redirect("/")
    }
})

module.exports = router;