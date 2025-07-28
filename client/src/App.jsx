import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/NavBar';
import AuthComponent from './pages/LoginRegister';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import TimeBank from './pages/TimeBank';
import Footer from './components/Footer';
import DeepSeekChat from './components/DeepSeekChat';
import ChatBox from './components/ChatBox';
import { useParams } from 'react-router-dom';


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showPopupChat, setShowPopupChat] = useState(false);
    const [popupReceiverId, setPopupReceiverId] = useState(null);
    const [popupReceiverName, setPopupReceiverName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch user on app load if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthLoading(false); // ✅ mark auth as finished even if no token
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setIsLoggedIn(true);
            } catch (err) {
                console.error("Failed to auto-login:", err);
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem('token');
            } finally {
                setAuthLoading(false); // ✅ done checking auth
            }
        };

        fetchUser();
    }, []);

    const openChatPopup = (receiverId, receiverName) => {
        setPopupReceiverId(receiverId);
        setPopupReceiverName(receiverName || 'User');
        setShowPopupChat(true);
    };


    const closeChatPopup = () => {
        setShowPopupChat(false);
        setPopupReceiverId(null);
    };


    const ChatWrapper = ({ user }) => {
        const { receiverId } = useParams();
        return <ChatBox userId={user._id} receiverId={receiverId} />;
    };


    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setUser(userData.user); // userData must have .user and .token
        localStorage.setItem('token', userData.token);
        navigate('/dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    };
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg font-medium animate-pulse">Checking authentication...</p>
            </div>
        );
    }

    return (

        <div className="w-full overflow-x-hidden">
            {/* Navbar appears on all pages */}
            <Navbar
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={handleLogout}
            />
            {/* Add top padding so content is not covered by fixed Navbar */}
            <div className="pt-16">
                {/* Routes for different pages */}
                <Routes>
                    <Route path="/loginandregister" element={<AuthComponent onLogin={handleLogin} />} />
                    <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} user={user} />} />
                    <Route
                        path="/chat/:receiverId"
                        element={
                            isLoggedIn && user ? (
                                <ChatWrapper user={user} />
                            ) : (
                                <AuthComponent onLogin={handleLogin} />
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            isLoggedIn && user ? (
                                <UserDashboard user={user} openChatPopup={openChatPopup} />
                            ) : (
                                <AuthComponent onLogin={handleLogin} />
                            )
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            isLoggedIn && user ? (
                                <ProfilePage user={user} />
                            ) : (
                                <AuthComponent onLogin={handleLogin} />
                            )
                        }
                    />
                    <Route path="/timebank" element={<TimeBank />} />
                    <Route
                        path="/GloabAid"
                        element={
                            isLoggedIn && user ? (
                                <DeepSeekChat user={user} />
                            ) : (
                                <AuthComponent onLogin={handleLogin} />
                            )
                        }
                    />
                </Routes>
                {showPopupChat && user && popupReceiverId && (
                    <div className="fixed bottom-4 right-24 z-50 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-xl border">
                        <ChatBox
                            userId={user._id}
                            receiverId={popupReceiverId}
                            userName={user?.name || 'You'}
                            receiverName={popupReceiverName}
                            onClose={closeChatPopup}
                            isOpen={true}
                        />
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );

};

export default App;
