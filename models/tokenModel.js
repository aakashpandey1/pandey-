const { default: mongoose } = require('mongoose')
const mongose=require('mongoose')
const{ObjectId}=mongose.Schema

const tokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400
    }
})

module.exports=mongoose.model('Token',tokenSchema)