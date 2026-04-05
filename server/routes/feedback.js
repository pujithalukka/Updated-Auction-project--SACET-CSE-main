import express from 'express';
import { createFeedback, getUserFeedbacks, getAllFeedbacks } from '../controllers/feedback.controller.js';
import auth from '../middleware/auth.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/create', auth, createFeedback);
feedbackRouter.get('/user', auth, getUserFeedbacks);
feedbackRouter.get('/all', getAllFeedbacks); // Remove auth middleware for public access

export default feedbackRouter;
