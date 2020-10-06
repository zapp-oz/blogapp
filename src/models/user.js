const mongoose = require("mongoose")
const validator = require("validator")
const bcrpyt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Blog = require("./../models/blog")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 6
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(val){
            const check = validator.isEmail(val);

            if(!check){
                throw new Error("Invaild Email!");
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    authtokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.virtual("blogs", {
    ref: "blog",
    localField: "_id",
    foreignField: "author"
})

userSchema.methods.toJSON = function(){
    const user = this.toObject()

    delete user.password
    delete user.authtokens

    return user
}

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id: this._id.toString()}, "helloworld")
    this.authtokens.push({token})
    
    await this.save()

    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username});

    if(!user){
        throw new error()
    } 

    const isVerified = await bcrpyt.compare(password, user.password)

    if(!isVerified){
        throw new error()
    }

    return user
}

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrpyt.hash(this.password, 8);
    }
    next()
})

userSchema.pre("remove", async function(next){
    await Blog.deleteMany({author: this._id})
    next()

})

const User = mongoose.model("user", userSchema);

module.exports = User;