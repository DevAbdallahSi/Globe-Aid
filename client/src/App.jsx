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
            <Navbar
                isLoggedIn={isLoggedIn}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />

            <Routes>

                <Route path="/" element={<AuthComponent onLogin={handleLogin} />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/dashboard" element={
                    isLoggedIn && user ? (
                        <UserDashboard user={user} />
                    ) : (
                        <AuthComponent onLogin={handleLogin} />
                    )
                } />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/timebank" element={<TimeBank />} />
            </Routes>

            <Footer />
        </div>
    );
};

export default App;
