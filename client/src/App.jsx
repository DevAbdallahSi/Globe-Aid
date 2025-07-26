import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    // Fetch user on app load if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(res.data)
                setUser(res.data);
                setIsLoggedIn(true);
            } catch (err) {
                console.error("Failed to auto-login:", err);
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem('token');
            }
        };

        fetchUser();
    }, []);

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
                                <UserDashboard user={user} />
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
                        path="/deepseek"
                        element={
                            isLoggedIn && user ? (
                                <DeepSeekChat user={user} />
                            ) : (
                                <AuthComponent onLogin={handleLogin} />
                            )
                        }
                    />                </Routes>

                {/* Footer appears on all pages */}

                <Footer />
            </div>
        </div>
    );

};

export default App;
