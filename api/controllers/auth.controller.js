import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken';
export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    console.log(req.body)
    if(!username ||!email||!password ||email===""||password===""||username===""){
        return next(errorHandler(400,'All fields are required'));
    }

    const hashedPassword=bcrypt.hashSync(password,10);
    try {
        const user= await User.create({
        username,
        email,
        password:hashedPassword
        }) 
        return res.status(201).json({'message':'User created successfully'});
    } catch (error) {
        //res.status(500).json({message:error.message});
        next(error)
        
    }
}

export const signin=async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email||!password||email===""||password===""){
        return next(errorHandler(400,'All fields are required'));
    }
    try {
        const user=await User.findOne({email:email})
        if(!user){
            return next(errorHandler(404,'User not found'));
        }
        const isMatch=bcrypt.compareSync(password,user.password);
        if(!isMatch){
            return next(errorHandler(400,'Invalid credentials'));
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=user._doc;
        return res.status(200).cookie('token',token,{httpOnly:true}).json({rest});
    } catch (error) {
        next(error)
    }
}