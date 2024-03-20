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
            ...(req.query.searchTearm && {
                $or:[
                    {title:{$regex:req.query.searchTearm,$options:'i'}},
                    {content:{$regex:req.query.searchTearm,$options:'i'}}
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