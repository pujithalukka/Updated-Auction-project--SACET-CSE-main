import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API}/api/verify-email/${token}`);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    setStatus('success');
                    setTimeout(() => navigate('/auction'), 2000);
                }
            } catch (error) {
                setStatus('error');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                {status === 'verifying' && (
                    <p className="text-gray-600">Verifying your email...</p>
                )}
                {status === 'success' && (
                    <p className="text-green-600">Email verified successfully! Redirecting...</p>
                )}
                {status === 'error' && (
                    <p className="text-red-600">Verification failed. Please try again or contact support.</p>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;