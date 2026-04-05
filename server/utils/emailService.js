import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "pujithalukka444@gmail.com",
        pass: "wukp-jcpxfwfsygpg"
    }
});

export const sendVerificationEmail = async (email, verificationToken) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'; // Fallback URL

    const mailOptions = {
        from: 'pujithalukka444@gmail.com',
        to: email,
        subject: 'Email Verification - Kipa Auction',
        html: `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${clientUrl}/verify-email/${verificationToken}">
                Verify Email
            </a>
            <p>This link will expire in 24 hours.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const mailOptions = {
        from: 'pujithalukka444@gmail.com',
        to: email,
        subject: 'Password Reset - Kipa Auction',
        html: `
            <h1>Password Reset Request</h1>
            <p>Please click the link below to reset your password:</p>
            <a href="${clientUrl}/reset-password/${resetToken}">
                Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

