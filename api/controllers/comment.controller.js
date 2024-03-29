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
export const editComment=async (req,res,next)=>{
    try {
        const  comment=await Comment.findById(req.params.commentId)
        if(!comment){
            return res.status(404).json("commment not found");
        }
        if(!req.user.isAdmin  && comment.userId!==req.user.id){
            return res.status(401).json("you are not allowed to edit this comment");
        }
        const editedComment=await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content
        },{new:true})
        res.status(201).json(editedComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(404).json('comment not found');
        }
        if(!req.user.isAdmin && comment.userId!==req.user.id){
            return res.status(401).json('you are not allowed to delete this comment');
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        return res.status(200).json("comment deleted successfully")
    } catch (error) {
        next(error);
    }
}

export const getAllComments=async(req,res,next)=>{
    try {
        if(!req.user.isAdmin){
            return res.status(401).json("you are not allowed")
        }
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit =parseInt(req.query.limit) || 9;
        const sortDirection=req.query.sort==='asc'?1:-1;
        const allComments=await Comment.find({}).sort({updatedAt:sortDirection}).limit(limit).skip(startIndex);
        const totalComments=await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        )
        const lastMonthComments=await Comment.countDocuments({updatedAt:{$gte:oneMonthAgo}})
        return res.status(200).json({allComments,totalComments,lastMonthComments})
    } catch (error) {
        next(error)
    }
}