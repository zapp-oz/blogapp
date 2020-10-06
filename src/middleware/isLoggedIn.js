const jwt = require("jsonwebtoken")
const User = require("./../models/user")

const isLoggedIn = async (req, res, next) => {
    try{
        const token = req.cookies.auth.replace("Bearer ", "")
        const isVerified = jwt.verify(token, "helloworld")
        const user = await User.findOne({_id: isVerified._id, "authtokens.token": token}) 
    

        res.locals.loggedInUser = user
    
        next()
    } catch(e){
        next()
    }
}

module.exports = isLoggedIn

