const express=require('express')
const {postOrder, orderList, orderDetails, updateStatus, userOrders}=require('../controllers/orderController')
const router=express.Router()
const{requireSignin}= require('../controllers/userController')

router.post('/postorder',requireSignin,postOrder)
router.get('/orderlist',orderList)
router.get('/orderdetails',orderDetails)
router.patch('/updatestatus/:id',updateStatus)
router.get('/userorders/:userId',userOrders)

module.exports=router
