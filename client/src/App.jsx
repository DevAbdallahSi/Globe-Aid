import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthComponent from './pages/LoginRegister';

const App = () => {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<><AuthComponent /></>} />
                <Route path="/dashboard" element={<>test</>} />
            </Routes>
        </div>
    );
};

export default App;