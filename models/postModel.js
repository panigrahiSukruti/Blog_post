const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Agriculture","Business","Entertainment","Health","Technology","Travel","Uncategorized"],
        message:"Value is not Supported"
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type:String, required: true
    }   , 
    thumbnail:{
        type: String,
        // required: true
    }    
    }
)       
module.exports = model('Post', postSchema)  