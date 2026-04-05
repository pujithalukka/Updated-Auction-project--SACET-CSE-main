import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Product from "../models/product.js";
import mongoose from "mongoose";
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

dotenv.config().parsed;

const handleSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser = new User({ 
            name, 
            email, 
            password,
            verificationToken,
            verificationTokenExpiry
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationToken);
        
        if (!emailSent) {
            return res.status(500).json({ error: "Failed to send verification email" });
        }

        return res.status(200).json({ 
            message: "Registration successful. Please check your email to verify your account." 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    
    try {
        const user = await User.findOne({ 
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        const authToken = jwt.sign(
            { userId: user._id, name: user.name, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '14d' }
        );

        return res.status(200).json({ token: authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist." });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '14d' }
        );
        
        return res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const handleDelete = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user first
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist." });
        }

        // Delete all posts of the user
        await Product.deleteMany({ seller: userId });

        // Delete the user
        await User.findOneAndDelete({ _id: userId });

        return res.status(200).json({ message: "User and all related posts deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleGetUser = async (req, res) => {
    const { seller } = req.body;
    console.log(seller);
    const user = await User.findOne({ _id: seller }, { name: 1, _id: 0 });
    return res.status(200).json(user);
}

const handleUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findOne({ _id: userId }, { password: 0 });
        if (!user) {
            console.log("hii");
            return res.status(400).json({ error: "User doesn't exist." });
        }
        const products = await Product.find({ seller: userId }).sort({ createdAt: -1 }).populate('seller', '_id name');
        if (products.length === 0) {
            return res.status(200).json({ message: "No products found.", user });
        }
        return res.status(200).json({ message: "User and Products", user, products });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Send password reset email
        const emailSent = await sendPasswordResetEmail(email, resetToken);
        
        if (!emailSent) {
            return res.status(500).json({ error: "Failed to send password reset email" });
        }

        return res.status(200).json({ 
            message: "Password reset instructions sent to your email" 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export { 
    handleSignup, 
    handleLogin, 
    verifyEmail, 
    handleDelete, 
    handleGetUser, 
    handleUser, 
    forgotPassword, 
    resetPassword 
};

