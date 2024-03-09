import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
const app =express();
const port =3000;

app.use(express.json());

dotenv.config();
console.log(process.env.MONGODBURL)
mongoose.connect(process.env.MONGODBURL).then(()=>console.log("mongodb connected !!")).catch((err)=>{  throw err})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.listen(port,()=>{
    console.log("app is running on port",port)
})