import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
export const signup=async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username ||!email||!password ||email===""||password===""||username===""){
        return res.status(400).json({'message':'All fields are required'});
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
        res.status(500).json({message:error.message});
    }
}