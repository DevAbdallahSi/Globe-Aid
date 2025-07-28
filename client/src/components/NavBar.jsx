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

    // Check if current path matches the link
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`fixed top-0 w-full z-50 py-2 sm:py-3 md:py-4 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50`}>
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300"
                >
                    {/* Earth Icon - Real emoji instead of custom SVG */}
                    <div className="text-2xl sm:text-3xl md:text-4xl">
                        🌍
                    </div>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                        GlobeAid
                    </span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                    <li className="relative group">
                        <Link
                            to="/"
                            className={`relative px-3 py-2 font-medium transition-all duration-300 ${isActiveLink('/')
                                    ? 'text-white'
                                    : 'text-gray-300 hover:text-white'
                                } text-sm lg:text-base`}
                        >
                            Home
                            {/* Active indicator */}
                            <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform transition-all duration-300 ${isActiveLink('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`}></div>
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                    </li>

                    {!isAuthPage && !isLoggedIn && (
                        <li className="relative group">
                            <a
                                href="#about"
                                onClick={(e) => {
                                    handleScroll(e, '#about');
                                    setMobileMenuOpen(false);
                                }}
                                className="relative px-3 py-2 font-medium text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base cursor-pointer"
                            >
                                About Us
                                {/* Hover indicator */}
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            </a>
                        </li>
                    )}

                    {isLoggedIn && (
                        <>
                            <li className="relative group">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`relative px-3 py-2 font-medium transition-all duration-300 ${isActiveLink('/dashboard')
                                            ? 'text-white'
                                            : 'text-gray-300 hover:text-white'
                                        } text-sm lg:text-base`}
                                >
                                    My Dashboard
                                    <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform transition-all duration-300 ${isActiveLink('/dashboard') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></div>
                                    <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                </Link>
                            </li>
                            <li className="relative group">
                                <Link
                                    to="/timebank"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`relative px-3 py-2 font-medium transition-all duration-300 ${isActiveLink('/timebank')
                                            ? 'text-white'
                                            : 'text-gray-300 hover:text-white'
                                        } text-sm lg:text-base`}
                                >
                                    My Time Bank
                                    <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform transition-all duration-300 ${isActiveLink('/timebank') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></div>
                                    <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                </Link>
                            </li>
                            <li className="relative group">
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`relative px-3 py-2 font-medium transition-all duration-300 ${isActiveLink('/profile')
                                            ? 'text-white'
                                            : 'text-gray-300 hover:text-white'
                                        } text-sm lg:text-base`}
                                >
                                    My Profile
                                    <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform transition-all duration-300 ${isActiveLink('/profile') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></div>
                                    <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                </Link>
                            </li>
                            <li className="text-sm lg:text-base font-medium text-gray-300 px-3 py-2">
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Hi, {user.name || user.email?.split('@')[0]} ✨
                                </span>
                            </li>
                        </>
                    )}

                    {!isAuthPage && (
                        <li>
                            <button
                                onClick={handleAuthAction}
                                className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-4 md:px-5 lg:px-6 py-2.5 rounded-full flex items-center gap-2 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 text-sm lg:text-base relative overflow-hidden group border border-white/10"
                                aria-label={isLoggedIn ? 'Logout' : 'Login or Register'}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="text-lg relative z-10">👤</span>
                                <span className="hidden lg:inline relative z-10 font-medium">{isLoggedIn ? 'Logout' : 'Login/Register'}</span>
                                <span className="lg:hidden relative z-10 font-medium">{isLoggedIn ? 'Logout' : 'Login'}</span>
                                {/* Button shine effect */}
                                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700"></div>
                            </button>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 focus:outline-none relative group"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                        <span className={`block h-0.5 w-full bg-gray-300 group-hover:bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-300 group-hover:bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-300 group-hover:bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-b border-purple-500/20 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                }`}>
                <div className="px-4 py-6">
                    <ul className="space-y-3">
                        <li>
                            <Link
                                to="/"
                                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink('/')
                                        ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-400'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                🏠 Home
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
                                    className="block px-4 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                                >
                                    ℹ️ About Us
                                </a>
                            </li>
                        )}

                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink('/dashboard')
                                                ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-400'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        📊 My Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/timebank"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink('/timebank')
                                                ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-400'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        ⏰ My Time Bank
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink('/profile')
                                                ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-400'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        👤 My Profile
                                    </Link>
                                </li>
                                <li className="px-4 py-3">
                                    <div className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        ✨ Hi, {user.name || user.email?.split('@')[0]}
                                    </div>
                                </li>
                            </>
                        )}

                        {!isAuthPage && (
                            <li className="pt-2">
                                <button
                                    onClick={handleAuthAction}
                                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium border border-white/10"
                                >
                                    <span className="text-xl">👤</span>
                                    {isLoggedIn ? 'Logout' : 'Login/Register'}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;