import express from 'express';
import{signup,signin,googleAuth, generateOtp} from '../controllers/auth.controller.js'
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',googleAuth)
router.post('/generateotp',generateOtp);
export default router;