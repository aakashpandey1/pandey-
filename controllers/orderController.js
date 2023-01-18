const OrderItem = require('../models/order-item')
const Order =require('../models/orderModel')

// post order 
exports.postOrder=async(req,res)=>{
const orderItemsIds=Promise.all(req.body.orderItems.map(async(orderItem)=>{
    let newOrderItem=new OrderItem({
        quantity:orderItem.quantity,
        product:orderItem.product,
    }) 
    newOrderItem=await newOrderItem.save()
    return newOrderItem._id
}))
const orderItemsIdsResolved=await orderItemsIds
// calculate total price 
const totalprice=await Promise.all(orderItemsIdsResolved.map(async(orderId)=>{
    const itemOrder=await OrderItem.findById(orderId).populate('product','product_price')
    const total=itemOrder.quantity*itemOrder.product.product_price
    return total 
}))
const Totalprice=totalprice.reduce((a,b)=>a+b,0)

let order=new Order({
    orderItems:orderItemsIdsResolved,
    shippingAddress1:req.body.shippingAddress1,
    shippingAddress2:req.body.shippingAddress2,
    zip:req.body.zip,
    city:req.body.city,
    country:req.body.country,
    phone:req.body.phone,
    totalPrice:Totalprice,
    user:req.body.user

})
order=await order.save()
if(!order){
    return res.status(400).json({error:'something went wrong'})

}
res.send(order)
}

// order list 
exports.orderList=async(req,res)=>{
    const order=await Order.find()
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'

        }
    })

    .sort({dateOrder:-1})
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(order)
}
// order details 
exports.orderDetails=async(req,res)=>{
    const order=await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'

        }
    })
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(order)
}
// update status 
exports.updateStatus=async(req,res)=>{
    const order=await Order.findById(
        req.params.id,
        {
            status:req.body.status
        },
        {new:true}



    )
if(!order){
return res.status(400).json({error:'something went wrong'})
}
res.send(order)
}
// user orders
exports.userOrders=async(req,res)=>{
    const userOrderList=await Order.find({user:req.params.userId})
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
    })
    if(!userOrderList){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(userOrderList)
}
