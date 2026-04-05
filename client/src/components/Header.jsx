// ... existing imports ...

const Header = () => {
    // ... existing code ...
    
    return (
        <nav>
            {/* ... existing navigation items ... */}
            {user && (
                <Menu.Item key="feedback">
                    <Link to="/feedback">
                        <FeedbackOutlined /> Feedback
                    </Link>
                </Menu.Item>
            )}
            {/* ... rest of the navigation ... */}
        </nav>
    );
};