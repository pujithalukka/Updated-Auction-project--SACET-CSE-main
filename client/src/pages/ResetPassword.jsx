import { Button, Card, Form, Input, message } from "antd";
import { FiHome } from "react-icons/fi";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return message.error("Passwords don't match");
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/api/reset-password/${token}`,
                { password: formData.password }
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
                    name="resetPassword"
                    layout="vertical"
                    onSubmitCapture={handleSubmit}
                >
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your new password!" }]}
                    >
                        <Input.Password
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            value={formData.password}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: "Please confirm your password!" }]}
                    >
                        <Input.Password
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            value={formData.confirmPassword}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;