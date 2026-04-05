import { Button, Card, Form, Input, message } from "antd";
import { FiHome } from "react-icons/fi";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return message.error("Please enter your email");
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/api/forgot-password`,
                { email }
            );
            message.success(response.data.message);
            navigate("/login");
        } catch (error) {
            message.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-svh min-w-full flex flex-col items-center justify-center">
            <Card bordered={true} style={{ width: 350 }}>
                <div className="flex justify-between px-4 pb-4">
                    <IoArrowBackSharp
                        size={28}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(-1)}
                    />
                    <FiHome
                        size={26}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </div>
                <Form
                    name="forgotPassword"
                    layout="vertical"
                    onSubmitCapture={handleSubmit}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Send Reset Link
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;