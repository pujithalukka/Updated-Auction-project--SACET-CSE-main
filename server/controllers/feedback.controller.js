import Feedback from '../models/feedback.js';

export const createFeedback = async (req, res) => {
    try {
        const { rating, comment, category } = req.body;
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = req.user.userId;

        if (!rating || !comment || !category) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newFeedback = new Feedback({
            userId,
            rating,
            comment,
            category
        });

        await newFeedback.save();
        
        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback: newFeedback
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: "Failed to submit feedback" });
    }
};

export const getUserFeedbacks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const feedbacks = await Feedback.find({ userId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error('Get feedbacks error:', error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10); // Limit to most recent 10 feedbacks
        
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error('Get all feedbacks error:', error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
};

