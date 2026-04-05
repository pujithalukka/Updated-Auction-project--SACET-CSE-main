import express from 'express';
import { 
    handleSignup, 
    handleLogin, 
    verifyEmail, 
    forgotPassword,
    resetPassword 
} from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/signup', handleSignup);
userRouter.post('/login', handleLogin);
userRouter.get('/verify-email/:token', verifyEmail);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);

export default userRouter;

