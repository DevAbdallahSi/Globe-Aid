import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthComponent from './pages/LoginRegister';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import TimeBank from './pages/TimeBank';

const App = () => {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<><AuthComponent /></>} />
                <Route path="/home" element={<><HomePage /></>} />
                <Route path="/dashboard" element={<><UserDashboard /></>} />
                <Route path="/Profile" element={<><ProfilePage /></>} />
                <Route path="/TimeBank" element={<><TimeBank /></>} />
            </Routes>
        </div>
    );
};

export default App;