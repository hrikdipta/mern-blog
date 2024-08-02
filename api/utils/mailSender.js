import nodemailer from "nodemailer";

export const sendMail =async (email,subject, body)=>{
    try {
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
            from:'verify@blogsphere.com',
            to: email,
            subject: subject,
            html: body,
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        return error;
    }
}