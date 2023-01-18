const express=require('express')
const {  postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { requireSignin } = require('../controllers/userController')
const { categoryValidation, validation } = require('../validation/validator')
const router=express.Router()



router.post('/postcategory',requireSignin,categoryValidation,validation,postCategory)
router.get('/categorylist',categoryList)
router.get('/categorydetails/:id',categoryDetails)
router.put('/updatecategory/:id',requireSignin,categoryValidation,validation,updateCategory)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)
 


module.exports=router