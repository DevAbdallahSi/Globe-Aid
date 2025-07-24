import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, onLogin, onLogout }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigate = useNavigate();

    const handleScroll = (e, targetId) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleAuthAction = () => {
        if (isLoggedIn) {
            onLogout();
            navigate('/');
        } else {
            onLogin();
            navigate('/login');
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 py-2 sm:py-3 md:py-4 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-white/95 backdrop-blur border-b border-white/20'}`}>
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent">
                    🌍 GlobeAid
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                    <li>
                        <Link
                            to="/#home"
                            className="font-medium hover:text-indigo-500 hover:-translate-y-0.5 transition-all text-sm lg:text-base"
                            onClick={(e) => handleScroll(e, '#home')}
                            aria-label="Navigate to Home"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/#about"
                            className="font-medium hover:text-indigo-500 hover:-translate-y-0.5 transition-all text-sm lg:text-base"
                            onClick={(e) => handleScroll(e, '#about')}
                            aria-label="Navigate to About Us"
                        >
                            About Us
                        </Link>
                    </li>
                    {isLoggedIn && user && (
                        <li className="text-sm lg:text-base font-medium">
                            Hi, {user.name || user.email.split('@')[0]}
                        </li>
                    )}
                    <li>
                        <button
                            className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-3 md:px-4 lg:px-6 py-2 rounded-full flex items-center gap-1 lg:gap-2 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl shadow-indigo-500/30 text-sm lg:text-base"
                            onClick={handleAuthAction}
                            aria-label={isLoggedIn ? "Logout" : "Login or Register"}
                        >
                            <span className="text-xs lg:text-sm">👤</span>
                            <span className="hidden lg:inline">
                                {isLoggedIn ? 'Logout' : 'Login/Register'}
                            </span>
                            <span className="lg:hidden">
                                {isLoggedIn ? 'Logout' : 'Login'}
                            </span>
                        </button>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center space-y-1">
                        <span className={`block h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-200 px-3 sm:px-4 py-4">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to="/#home"
                                className="block font-medium hover:text-indigo-500 transition-all py-2"
                                onClick={(e) => {
                                    handleScroll(e, '#home');
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/#about"
                                className="block font-medium hover:text-indigo-500 transition-all py-2"
                                onClick={(e) => {
                                    handleScroll(e, '#about');
                                    setMobileMenuOpen(false);
                                }}
                            >
                                About Us
                            </Link>
                        </li>
                        {isLoggedIn && user && (
                            <li className="block font-medium py-2">
                                Hi, {user.name || user.email.split('@')[0]}
                            </li>
                        )}
                        <li>
                            <button
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                                onClick={handleAuthAction}
                            >
                                <span>👤</span>
                                {isLoggedIn ? 'Logout' : 'Login/Register'}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

Navbar.defaultProps = {
    isLoggedIn: false,
    user: null,
    onLogin: () => console.log('Login clicked'),
    onLogout: () => console.log('Logout clicked')
};

export default Navbar;
