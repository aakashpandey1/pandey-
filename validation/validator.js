const{check,validationResult}=require('express-validator')

exports.categoryValidation=[
    check('category_name','Category must be required').notEmpty()
    .isLength({min:3})
    .withMessage('category name must contain at least 3 characters')

]
exports.productValidation=[
    check('product','Product must be required').notEmpty()
    .isLength({min:3})
    .withMessage('product name must contain at least 3 characters'),

    check('product_price','price is required').notEmpty()
    .isNumeric()
    .withMessage('price only contain numeric value'),

    check('countInStock','Stock Quantity  is required').notEmpty()
    .isNumeric()
    .withMessage('Stock Quantity only contain numeric value'),

    check('product_description','Description name must be  required').notEmpty()
    .isLength({min:30})
    .withMessage('product description must  contain at least 30 character'),

    check('product','product is required').notEmpty()
    
    
]
exports.userValidation=[
    check('name','Name is required').notEmpty()
    .isLength({min:2}).withMessage('name should be at least of 2 characters'),
    
    check('email','Email is required').notEmpty()
    .isEmail().withMessage('Invalid email format'),

    check('password','password is required').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain one lowercase alphabet')
    .matches(/[]A-Z/).withMessage('password must contain one uppercase alphabet')
    .matches(/[]0-9/).withMessage('password must contain one numeric digit')
    .matches(/[@#$%&*?.^-_]/).withMessage('password must contain one special character')
    .isLength({min:8}).withMessage('password must contain minimum of 8 characters')
    .isLength({max:100}).withMessage('password must not exceed more than 100 characters')
    

]



exports.validation=(req,res,next)=>{
    const errors =validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error:errors.array()[0].msg})
    }
    

}