const express=require('express')
const { postProduct, productDetails ,productList, updateProduct, deleteProduct} = require('../controllers/productController')
const router=express.Router()
const upload=require('../middleware/file-upload')
const { productValidation, validation } = require('../validation/validator')
const {requireSignin}=require('../controllers/userController')



router.post('/postproduct',upload.single('product_image'),productValidation,validation,postProduct)
router.get('/productlist',productList)
router.get('/productdetails/:id',productDetails)
router.delete('/deleteproduct/:id',deleteProduct)
router.put('/updateproduct/:id',requireSignin,updateProduct)



module.exports=router