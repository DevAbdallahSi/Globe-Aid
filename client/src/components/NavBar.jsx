import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isAuthPage = location.pathname === '/loginandregister';

    const handleAuthAction = () => {
        if (isLoggedIn) {
            onLogout();
        } else {
            navigate('/loginandregister');
        }
        setMobileMenuOpen(false);
    };

    const handleScroll = (e, targetId) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 py-2 sm:py-3 md:py-4 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-white/95 backdrop-blur border-b border-white/20'}`}>
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent">
                    🌍 GlobeAid
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                    <li>
                        <Link
                            to="/"
                            className={`${isLoggedIn
                                ? 'font-medium hover:text-indigo-500 transition-all text-sm lg:text-base'
                                : 'text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent'
                            }`}
                        >
                            Home
                        </Link>
                    </li>

                    {!isAuthPage && !isLoggedIn && (
                        <li>
                            <a
                                href="#about"
                                onClick={(e) => {
                                    handleScroll(e, '#about');
                                    setMobileMenuOpen(false);
                                }}
                                className={`${isLoggedIn
                                    ? 'font-medium hover:text-indigo-500 transition-all text-sm lg:text-base'
                                    : 'text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent'
                                }`}
                            >
                                About Us
                            </a>
                        </li>
                    )}

                    {isLoggedIn && (
                        <>
                            <li><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-medium hover:text-indigo-500 transition-all text-sm lg:text-base">My Dashboard</Link></li>
                            <li><Link to="/timebank" onClick={() => setMobileMenuOpen(false)} className="font-medium hover:text-indigo-500 transition-all text-sm lg:text-base">My Time Bank</Link></li>
                            <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="font-medium hover:text-indigo-500 transition-all text-sm lg:text-base">My Profile</Link></li>
                            <li className="text-sm lg:text-base font-medium">Hi, {user.name || user.email?.split('@')[0]}</li>
                        </>
                    )}

                    {!isAuthPage && (
                        <li>
                            <button
                                onClick={handleAuthAction}
                                className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-3 md:px-4 lg:px-6 py-2 rounded-full flex items-center gap-1 lg:gap-2 hover:-translate-y-0.5 hover:scale-105 transition-all shadow-lg hover:shadow-xl shadow-indigo-500/30 text-sm lg:text-base relative overflow-hidden group"
                                aria-label={isLoggedIn ? 'Logout' : 'Login or Register'}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-xs lg:text-sm relative z-10">👤</span>
                                <span className="hidden lg:inline relative z-10">{isLoggedIn ? 'Logout' : 'Login/Register'}</span>
                                <span className="lg:hidden relative z-10">{isLoggedIn ? 'Logout' : 'Login'}</span>
                            </button>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                        <span className={`block h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-4">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to="/"
                                className={`${isLoggedIn
                                    ? 'block font-medium hover:text-indigo-500 transition-all py-2'
                                    : 'block text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>

                        {!isAuthPage && !isLoggedIn && (
                            <li>
                                <a
                                    href="#about"
                                    onClick={(e) => {
                                        handleScroll(e, '#about');
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`${isLoggedIn
                                        ? 'block font-medium hover:text-indigo-500 transition-all py-2'
                                        : 'block text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent'
                                    }`}
                                >
                                    About Us
                                </a>
                            </li>
                        )}

                        {isLoggedIn && (
                            <>
                                <li><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block font-medium hover:text-indigo-500 transition-all py-2">My Dashboard</Link></li>
                                <li><Link to="/timebank" onClick={() => setMobileMenuOpen(false)} className="block font-medium hover:text-indigo-500 transition-all py-2">My Time Bank</Link></li>
                                <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block font-medium hover:text-indigo-500 transition-all py-2">My Profile</Link></li>
                                <li className="block font-medium py-2">Hi, {user.name || user.email?.split('@')[0]}</li>
                            </>
                        )}

                        {!isAuthPage && (
                            <li>
                                <button
                                    onClick={handleAuthAction}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                                >
                                    👤 {isLoggedIn ? 'Logout' : 'Login/Register'}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
