import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import {errorHandler} from '../utils/error.js'
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