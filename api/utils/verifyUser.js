import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyUser=(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return next(errorHandler(401,'no token'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'UnAuthorized'));
        }
        req.user=user;
        next();
    })
}