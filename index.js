const express=require('express')
const app=express()
require('dotenv').config()
const db=require('./database/connection')
const bodyParser=require('body-parser')
const cors=require('cors')

const categoryRoutes=require('./routes/categoryRoute')
const productRoutes=require('./routes/productRoute')
const userRoutes=require('./routes/userRoute')
const orderRoute=require('./routes/orderRoute')
const paymentRoutes=require('./routes/paymentRoutes')


// middleware 
app.use(bodyParser.json())
app.use('/public/uploads',express.static('public/uploads'))
app.use(cors())


// routes middleware 
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api',userRoutes)
app.use('/api',orderRoute)
app.use('/api',paymentRoutes)



  const port=process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})