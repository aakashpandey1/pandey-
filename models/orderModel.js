const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema


const orderItemSchema=new mongoose.Schema({
    orderItems:[{
        type:ObjectId,
        ref:'OrderItem',
        required:true
    }],
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String
    },
    zip:{
        type:Number,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    totalPrice:{

        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'Pending'
    },
    user:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    dateOrder:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model('Order',orderItemSchema)