import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
const app =express();
const port =3000;

app.use(cors());

app.use(express.json());

dotenv.config();
// console.log(process.env.MONGODBURL)
mongoose.connect(process.env.MONGODBURL).then(()=>console.log("mongodb connected !!")).catch((err)=>{  throw err})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)



app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})
app.listen(port,()=>{
    console.log("app is running on port",port)
})