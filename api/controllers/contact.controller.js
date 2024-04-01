import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
export const contact= async(req,res,next)=>{
    try {
        const {name,email,message}=req.body;
        if(!name || !email || !message){
            return next(errorHandler(400,"All fields are required !!"));
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });
        const mailOptions = {
            from: email,
            to: process.env.EMAIL,
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return next(errorHandler(500,"An error occurred, please try again later"));
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Email sent successfully",
                });
            }
        });
    } catch (error) {
        next(error);
    }
}