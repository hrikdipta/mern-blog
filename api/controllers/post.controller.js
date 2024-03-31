import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost= async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(401,'You are not allowed to create post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,'Title and Content are required'))
    }
    const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
    try {
        const post =await Post.create({
            ...req.body,
            userId:req.user.id,
            slug
        });
        return res.status(201).json(post);
    } catch (error) {
        next(error);
    }
}
export const getposts=async(req,res,next)=>{
    try {
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) ||9 ;
        const sortDirection= req.query.order === 'asc' ? 1 :-1;
        const posts=await Post.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.catagory && {catagory : req.query.catagory}),
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            })
        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);
        const totalPosts=await Post.countDocuments();

        const now=new Date();
        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );
        const lastMonthPosts =await Post.countDocuments({
            updatedAt:{$gte:oneMonthAgo}
        })
        return res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
    } catch (error) {
        next(error);
    }
}

export const deletePost=async(req,res,next)=>{
    if(!req.user.isAdmin || req.user.id!==req.params.userId){
        return next(errorHandler(401,'You are not allowed to delete post'));
    }
    try {
        const response=await Post.findByIdAndDelete(req.params.postId);
        if(!response){
            return next(errorHandler(404,'Post not found'));
        }
        return res.status(200).json("Post has been deleted")
    } catch (error) {
        next(error);
    }
}
export const updatePost= async(req,res,next)=>{
    if(!req.user.isAdmin || req.user.id!=req.params.userId){
        return next(errorHandler(401,'You are not allowed to update post'));
    }
    try {
        const updatedPost= await Post.findByIdAndUpdate(req.params.postId,{
            $set:{
                title:req.body.title,
                image:req.body.image,
                content:req.body.content,
                catagory:req.body.catagory
            }
        },{new:true})
        return res.status(200).json(updatedPost)
    } catch (error) {
        next(error)
    }
}
