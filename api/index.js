import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
const app =express();
const port =3000;

dotenv.config();
console.log(process.env.MONGODBURL)
mongoose.connect(process.env.MONGODBURL).then(()=>console.log("mongodb connected !!")).catch((err)=>{  throw err})

app.use('/api/user',userRouter)

app.listen(port,()=>{
    console.log("app is running on port",port)
})