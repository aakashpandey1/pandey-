const express=require('express')
const {userRegister, postEmailConfirmation, signIn, forgetPassword, resetPassword, userList, userDetails, requireSignin, signOut, resendEmailConfirmation}=require('../controllers/userController')
const router=express.Router()


router.post('/register',userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.get('/userlist',requireSignin,userList)
router.get('/userdetails/:id',requireSignin,userDetails)
router.post('/signout',signOut)
router.post('/resendemailconfirmation',resendEmailConfirmation)

module.exports=router