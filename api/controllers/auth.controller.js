import User from "../models/user.model.js"
import Otp from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken';
import otpGenerator from "otp-generator";
import {sendMail } from '../utils/mailSender.js'
export const generateOtp=async(req,res,next)=>{
    const {email}=req.body;
    if(!email || email===""){
        return next(errorHandler(400,'Email is required'));
    }
    const isUserExist = await User.findOne({email:email});
    if(isUserExist)
        return next(errorHandler(400,'User Already exsist'));
    const otp=otpGenerator.generate(6,{upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
    // send an email
    const newMail= await sendMail(email,"Verification Email",`<h2>Please confirm your OTP</h2>
       <p>Here is your OTP code: ${otp}</p>`);
    if(!newMail)
        return next(errorHandler(500,"Internal server error"));
    const savedOtp = await Otp.findOneAndUpdate({email},{otp})
    if(!savedOtp){
        await Otp.create({
            email,
            otp
        })
    }
    return res.status(200).json('otp sent successfully');
}

export const signup = async(req,res,next)=>{
    const {username,email,password,otp} = req.body;
    if(!username ||!email||!password ||!otp ||email===""||password===""||username===""){
        return next(errorHandler(400,'All fields are required'));
    }
    const savedOtp= await Otp.findOne({email:email});
    if(!savedOtp || savedOtp?.otp !=otp)
        return next(errorHandler(400,"otp doesn't match"));
    try {
        const hashedPassword=bcrypt.hashSync(password,10);
        const newUser=await User.create({
            username,
            email,
            password : hashedPassword
        });
        await Otp.deleteMany({email:email});
        const token =jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
        const {password:pass,...rest}=newUser._doc;
        return res.status(201).cookie('token',token,{httpOnly:true}).json(rest);
    } catch (error) {
        next(error);
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
        const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
        const {password:pass,...rest}=user._doc;
        return res.status(200).cookie('token',token,{httpOnly:true}).json(rest);
    } catch (error) {
        next(error)
    }
}
export const googleAuth=async(req,res,next)=>{
    const {username,email,photoURL}=req.body;
    try {
        const user = await User.findOne({email:email});
        if(user){
            const token =jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
            const {password,...rest}=user._doc;
            return res.status(200).cookie('token',token,{httpOnly:true}).json(rest);
        }else{
            const randomPassword=Math.random().toString(36).substring(7);
            const hashedPassword=bcrypt.hashSync(randomPassword,10);
            const newUser=await User.create({
                username:username.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
                photoURL
            })
            const token =jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
            const {password,...rest}=newUser._doc;
            return res.status(200).cookie('token',token,{httpOnly:true}).json(rest);
        }
    } catch (error) {
        next(error)
    }
}

export const verifyUser= async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return next(errorHandler(401,'please login first'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'UnAuthorized'));
        }
        return res.status(200).json({"message":"user verified successfully"});
    })
}