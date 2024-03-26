import Comment from '../models/comment.model.js'
import {errorHandler} from '../utils/error.js'
export const createComment=async(req,res,next)=>{
    try {
        const{content,postId,userId}=req.body;
        if(!content || !postId || !userId){
            return next(errorHandler(401,'content is required'))
        }
        if(userId!==req.user.id){
            return next(errorHandler(403,'You are not allowed to create a comment'))
        }
        const newComment= await Comment.create({
            content,
            postId,
            userId
        })
        return res.status(200).json(newComment);
    } catch (error) {
        next(error)
    }
}