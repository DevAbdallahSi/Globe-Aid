import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

    const handleLogin = (userData) => {
        // Set login state and user data
        setIsLoggedIn(true);
        setUser(userData || {
            name: "John Doe",
            email: "john@example.com"
        });
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token'); // Optional: clear token
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
                <Route path="/login" element={<AuthComponent onLogin={handleLogin} />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/timebank" element={<TimeBank />} />
            </Routes>

            <Footer />
        </div>
    );
};

export default App;
