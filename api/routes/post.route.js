import express from 'express';
import {verifyUser} from '../utils/verifyUser.js';
import { createPost,getposts,deletePost } from '../controllers/post.controller.js';
const router = express.Router();

router.post('/create',verifyUser,createPost);
router.get('/getposts',getposts)
router.delete('/delete/:postId/:userId',verifyUser,deletePost)
export default router;