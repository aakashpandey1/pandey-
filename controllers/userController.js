const User = require('../models/authModel')
const sendEmail=require('../middleware/setEmail')
const Token=require('../models/tokenModel')
const crypto=require('crypto')
const jwt=require('jsonwebtoken') //authentication
const {expressjwt} = require('express-jwt') //authorization
const { ConnectionStates } = require('mongoose')

//register user
exports.userRegister=async(req,res)=>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    User.findOne({email:user.email},async(error,data)=>{
        //model ko email and user ko email chahi data bata pathaune
        if(data==null){
            user= await user.save()
            if(!user){
                return res.status(400).json({error:'something went wrong'})
            }
            //to store token in model
         let token= new Token({
            token:crypto.randomBytes(16).toString('hex'),
            userId:user._id
         })
         token = await token.save()
         if(!token){
            return res.status(400).json({error:'something went wrong'})
         }
         //send mail
         sendEmail({
            from:'no-replay@ecommerce.com',
            to:user.email,
            subject:'Email verification Link',
            text:`Hello,\n\n Please verify your email by click in the below link \n\n
            http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}
            `
            //http://locahost:8000/api/confirmation
         })

            res.send(user)
        }
        else{
            return res.status(400).json({error:'email must be unique'})
        }
    })
}


//confirming email
exports.postEmailConfirmation=(req,res)=>{
//at first find the matching or valid token
Token.findOne({token:req.params.token},(error,token)=>{
    if(error || !token){
        return res.status(400).json({error:'invalid token or token may have expired'})
    }
    //if token found then find the valid user for that token
    User.findOne({_id:token.userId},(error,user)=>{
        if(error || !user){
            return res.status(400).json({error:'we are unable to find the valid user for this token'})
        }

        //check if user is already verified or not
        if(user.isVerified){
            return res.status(400).json({error:'this email is already verified, login to continue'})
        }
        //save the verified user
        user.isVerified=true
        user.save((error)=>{
            if(error){
                return res.status(400).json({error:error})
            }
            res.json({message:'congrats! your email has been verified login to continue'})
        })
    })
})
}
// signin process 
exports.signIn=async(req,res)=>{
    const{email,password}=req.body
    // at first check if email is registered in the system or not 
    const user =await User.findOne({email})
    if(!user){
        return res.status(403).json({error:'sorry the email you provided not found in out system,please register first or try another '})
    }
    // if email found then chek the correct password for that email 
    if(!user.authenticate(password)){
        return res.status(400).json({error:'email or password doesnot match'})
    }
    // check if user is verified or not 
    if(!user.isVerified){
        return res.status(400).json({error:'please verify your email to continue the process'})
    }
    // now generate token with user id and jwt secret 
    const token =jwt.sign({_id:user._id},process.env.JWT_SECRET)
    
    // store token in the cookie 
    res.cookie('myCookie',token,{expire:Date.now()+999999})
    // return user information to frontend 
    const {_id,name,role}=user 
    return res.json({token,user:{_id,name,email,role}})
}
// for forget password 

exports.forgetPassword=async(req,res)=>{
    const{email,password}=req.body
    // at first check if email is registered in the system or not 
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return res.status(403).json({error:'sorry the email you provided not found in out system,please register first or try another '})

    }
      //to store token in model
      let token= new Token({
        token:crypto.randomBytes(16).toString('hex'),
        userId:user._id
     })
     token = await token.save()
     if(!token){ 
        return res.status(400).json({error:'something went wrong'})
     }
     //send mail
     sendEmail({
        from:'no-replay@ecommerce.com',
        to:user.email,
        subject:'password Reset Link',
        text:`Hello,\n\n Please reset your password by click in the below link \n\n
        http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}
        `
        //http://locahost:8000/api/resetpassword
     })
     res.json({message:'password reset link has been sent to your email '})
}
// reset password 
exports.resetPassword=async(req,res)=>{
    // at first find the valid token 
    const token =await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:'invalid token or token may have expired'})

    }
    // if token found then find the valid user for that token 
    let user=await User.findOne({_id:token.userId})
    if(!user){
        return res.status(400).json({error:'we are unable to find the valid user for this token'})
    }
    // reset password function 
    user.password=req.body.password
    user=await user.save()
    if(!user){
        return res.status(400).json({error:'failed to reset password'})
    }
    res.json({message:'password has been reset successfully'})

}
// user list 
exports.userList=async(req,res)=>{
    const user=await User.find().select('-hashed_password')
    .select('-salt')
    
    if(!user){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(user)
}
// user details 
exports.userDetails=async(req,res)=>{
    const user=await User.findById(req.params.id)
    .select('-hashed_password')
    .select('-salt')
    
    if(!user){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(user)
}

// require signin 
exports.requireSignin=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256']
})
// signout 
exports.signOut=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout success'})
}
// resend Password confirmation 
exports.resendEmailConfirmation=async(req,res)=>{
    const{email}=req.body
    // at first check if email is registered in the system or not 
    const user =await User.findOne({email})
    if(!user){
        return res.status(403).json({error:'sorry the email you provided not found in out system,please register first or try another '})
    }
    
    
     let token= new Token({
        token:crypto.randomBytes(16).toString('hex'),
    userId:user._id
})
token = await token.save()
if(!token){ 
    return res.status(400).json({error:'something went wrong'})
 }
 sendEmail({
    from:'no-replay@ecommerce.com',
    to:user.email,
    subject:'email resend Link',
    text:`Hello,\n\n Please resend your email by click in the below link \n\n
    http:\/\/${req.headers.host}\/api\/resendemail\/${token.token}
    `
    //http://locahost:8000/api/resetpassword
 })
 res.json({message:'email resend link has been sent to your email '})
 
 
}

