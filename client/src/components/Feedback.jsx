import { useState } from 'react';
import { Form, Input, Rate, Select, Button, message } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const Feedback = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `${import.meta.env.VITE_API}/api/feedback/create`,
                values,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            message.success('Thank you for your feedback!');
            form.resetFields();
        } catch (error) {
            console.error('Feedback submission error:', error);
            message.error(error.response?.data?.error || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Submit Feedback</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="rating"
                    label="Rate your experience"
                    rules={[{ required: true, message: 'Please rate your experience' }]}
                >
                    <Rate />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Feedback Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select>
                        <Select.Option value="General">General</Select.Option>
                        <Select.Option value="Bug Report">Bug Report</Select.Option>
                        <Select.Option value="Feature Request">Feature Request</Select.Option>
                        <Select.Option value="User Experience">User Experience</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="comment"
                    label="Your Feedback"
                    rules={[{ required: true, message: 'Please enter your feedback' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Please share your thoughts..."
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        Submit Feedback
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Feedback;
