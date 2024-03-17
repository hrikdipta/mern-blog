import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const test=(req,res)=>{
    res.send("user route")
}
export const updateUser=async(req,res,next)=>{
   if(req.user.id!==req.params.userId){
    return next(errorHandler(401,'UnAuthorized'))
   }
   if(req.body.password){
        if(req.body.password.length<6){
            return next(errorHandler(400,'Password must be atleast 6 characters'));
        }
        req.body.password=bcrypt.hashSync(req.body.password,10);
   }
   try {
        const updatedUser =await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                photoURL:req.body.photoURL
            }
        },{new:true})
        if(!updatedUser){
            return next(errorHandler(404,"User not found"))
        }
        const {password,...rest}=updatedUser._doc;
        res.status(200).json(rest);
   } catch (error) {
    next(error);
   }
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.userId){
        return next(errorHandler(401,'UnAuthorized'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.clearCookie('token').status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

export const signout=(req,res)=>{
    try {
        res.clearCookie('token').status(200).json("User has been signed out");
    } catch (error) {
        next(error);
    }
}

export default test; 