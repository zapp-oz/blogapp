const jwt = require("jsonwebtoken")
const User = require("./../models/user")

const auth = async (req, res, next) => {
    
    try{
        const token = req.cookies.auth.replace("Bearer ", "")
        const isVerified = jwt.verify(token, "helloworld")
        const user = await User.findOne({_id: isVerified._id, "authtokens.token": token})

        if(!user){
            throw new Error();
        }

        req.token = token
        req.user = user

        next()
    } catch(e){
        res.redirect("/login")
    }
    
}

module.exports = auth