const mongoose = require("mongoose")

const blog = mongoose.Schema({
    title:{
        type: String, 
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    }, 
    date:{
        type: Date,
        default: Date.now("January 2020"),
        required: true
    },
    content:{
        type: String, //check this
        required: true
    },
    imagesrc:{
        type: String
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
})

const Blog = new mongoose.model("blog", blog)

module.exports = Blog