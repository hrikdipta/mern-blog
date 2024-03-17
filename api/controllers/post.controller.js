import Post from "../models/post.model.js";

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