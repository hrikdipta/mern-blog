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

export const getPostComments=async(req,res,next)=>{
    try {
        const allComments= await Comment.find({postId:req.params.postId}).sort({createdAt:-1})
        return res.status(200).json(allComments)
    } catch (error) {
        next(error)
    }
}
export const likeComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId)
        if(!comment){
            return res.status(404).json("comment not found");
        }
        const userIndex=comment.likes.indexOf(req.user.id);
        if(userIndex===-1){
            comment.numberOfLikes+=1;
            comment.likes.push(req.user.id)
        }else{
            comment.numberOfLikes-=1;
            comment.likes.splice(userIndex,1)
        }
        await comment.save();
        return res.status(201).json(comment)
    } catch (error) {
        next(error)
    }
}