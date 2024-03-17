import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    photoURL:{
        type:String,
        default:"https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const User=mongoose.model('User',userSchema);   // User is the name of the collection in the database
export default User;