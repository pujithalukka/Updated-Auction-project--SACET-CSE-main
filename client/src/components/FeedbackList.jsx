import { useEffect, useState } from 'react';
import { List, Card, Rate, Tag, Spin } from 'antd';
import axios from 'axios';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API}/api/feedback/user`);
                setFeedbacks(response.data.feedbacks);
            } catch (error) {
                console.error('Failed to fetch feedbacks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'blue',
            'Reviewed': 'orange',
            'Implemented': 'green',
            'Rejected': 'red'
        };
        return colors[status] || 'default';
    };

    if (loading) return <Spin size="large" />;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Feedback History</h2>
            <List
                grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
                dataSource={feedbacks}
                renderItem={(item) => (
                    <List.Item>
                        <Card>
                            <div className="flex justify-between items-start mb-4">
                                <Rate disabled defaultValue={item.rating} />
                                <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                            </div>
                            <div className="mb-2">
                                <Tag color="purple">{item.category}</Tag>
                            </div>
                            <p className="text-gray-600">{item.comment}</p>
                            <div className="text-sm text-gray-400 mt-4">
                                Submitted on: {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default FeedbackList;