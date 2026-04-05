import { useEffect, useState } from 'react';
import { List, Card, Rate, Tag, Spin, Statistic, Row, Col, Flex, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuOutlined } from "@ant-design/icons";
import axios from 'axios';
import Footer from './Footer';

const PublicFeedbacks = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalFeedbacks: 0,
    });

    const navMenu = [
        {
            title: "Home",
            url: "/",
        },
        {
            title: "Features",
            url: "#",
        },
        {
            title: "Testimonials",
            url: "/testimonials",
        },
        {
            title: "Contact",
            url: "#",
        },
    ];

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API}/api/feedback/all`);
                const allFeedbacks = response.data.feedbacks;
                setFeedbacks(allFeedbacks);
                
                const avgRating = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / allFeedbacks.length;
                setStats({
                    averageRating: avgRating.toFixed(1),
                    totalFeedbacks: allFeedbacks.length,
                });
            } catch (error) {
                console.error('Failed to fetch feedbacks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <>
            {/* Navigation Bar */}
            <nav className="bg-white">
                <Flex
                    align="center"
                    justify="space-between"
                    className="container px-6 py-4 mx-auto lg:px-12"
                >
                    <Typography.Title 
                        level={3} 
                        style={{ margin: 0, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Kipa Auction
                    </Typography.Title>
                    <Flex
                        align="center"
                        justify="space-between"
                        className="hidden md:flex"
                    >
                        {navMenu.map((menu, index) => (
                            <Button 
                                key={index} 
                                type="text" 
                                size="large"
                                onClick={() => menu.url.startsWith('#') ? null : navigate(menu.url)}
                            >
                                {menu.title}
                            </Button>
                        ))}
                    </Flex>
                    <Flex
                        align="center"
                        justify="space-between"
                        className="hidden md:flex gap-4"
                    >
                        <Button onClick={() => navigate("/login")}>Login</Button>
                        <Button type="primary" onClick={() => navigate("/signup")}>
                            Sign up
                        </Button>
                    </Flex>
                </Flex>
            </nav>

            {/* Testimonials Content */}
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-semibold mb-6">What Our Users Say</h2>
                
                {loading ? (
                    <Spin size="large" className="flex justify-center mt-8" />
                ) : (
                    <>
                        {/* Statistics Section */}
                        <Row gutter={16} className="mb-8">
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Average Rating"
                                        value={stats.averageRating}
                                        prefix={<Rate disabled allowHalf defaultValue={parseFloat(stats.averageRating)} />}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Total Reviews"
                                        value={stats.totalFeedbacks}
                                        suffix="reviews"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Feedbacks List */}
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                            dataSource={feedbacks}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card className="h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <Rate disabled defaultValue={item.rating} />
                                            <Tag color="purple">{item.category}</Tag>
                                        </div>
                                        <p className="text-gray-600 mb-4">{item.comment}</p>
                                        <div className="text-sm text-gray-400">
                                            <p>By: {item.userId.name}</p>
                                            <p>Posted: {new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default PublicFeedbacks;
