import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const audienceContent = {
        students: {
            title: "International Students",
            content: "Navigate university life, academic culture, social expectations, and build lasting friendships. Get help with everything from understanding grading systems to joining clubs and managing academic stress in a new cultural environment."
        },
        expats: {
            title: "Expats & Professionals",
            content: "Adapt to your new work environment, understand professional etiquette, and build meaningful personal relationships. Learn about local business culture, networking opportunities, and work-life balance in your new country."
        },
        immigrants: {
            title: "Immigrants & Refugees",
            content: "Get comprehensive support for permanent relocation, including understanding legal systems, healthcare, education options, and community integration. Access resources for language learning and cultural adaptation at your own pace."
        },
        tourists: {
            title: "Tourists & Travelers",
            content: "Make the most of your visit with cultural insights, etiquette tips, and local customs knowledge. Avoid cultural faux pas, discover authentic experiences, and connect respectfully with local communities during your travels."
        }
    };

    const countries = [
        { flag: "🇺🇸", name: "United States", description: "Navigate American culture, education, and social norms", id: "usa" },
        { flag: "🇬🇧", name: "United Kingdom", description: "Discover British customs, university life, and traditions", id: "uk" },
        { flag: "🇨🇦", name: "Canada", description: "Explore Canadian multiculturalism and community values", id: "canada" },
        { flag: "🇦🇺", name: "Australia", description: "Learn about Aussie lifestyle and cultural diversity", id: "australia" },
        { flag: "🇩🇪", name: "Germany", description: "Understand German efficiency, culture, and social systems", id: "germany" },
        { flag: "🌍", name: "More Countries", description: "Explore our full list of supported destinations", id: "more" }
    ];

    const features = [
        { icon: "🤖", title: "AI Cultural Assistant", description: "Get instant answers about local customs, social norms, and cultural nuances through our intelligent chat system." },
        { icon: "💬", title: "24/7 Emotional Support", description: "Access round-the-clock emotional guidance to help you navigate homesickness, culture shock, and adaptation challenges." },
        { icon: "🌐", title: "Community Connection", description: "Connect with others from your background or locals who understand your journey in your new environment." },
        { icon: "📚", title: "Personalized Learning", description: "Receive customized cultural learning paths based on your specific situation, goals, and interests." }
    ];

    const testimonials = [
        {
            text: "GlobeAid helped me understand American university culture so much better. The AI assistant answered all my questions about campus life, and I finally felt confident joining study groups.",
            author: "Maria Rodriguez",
            role: "International Student, MIT",
            avatar: "👩‍🎓"
        },
        {
            text: "Moving to Germany for work was overwhelming until I found GlobeAid. The cultural insights and emotional support helped me adapt so much faster than I expected.",
            author: "James Park",
            role: "Software Engineer, Berlin",
            avatar: "👨‍💼"
        },
        {
            text: "As a refugee, understanding Canadian systems and culture was crucial. GlobeAid's AI assistant was patient and helpful, making my integration journey smoother.",
            author: "Ahmed Hassan",
            role: "New Canadian Resident",
            avatar: "👨‍👩‍👧"
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const selectCountry = (countryId) => {
        console.log('Selected country:', countryId);
    };

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

    return (
        <div className="font-sans text-gray-800 bg-gradient-to-br from-indigo-500 to-purple-700 min-h-screen overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 py-2 sm:py-3 md:py-4 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-white/95 backdrop-blur border-b border-white/20'}`}>
                <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent">
                        🌍 GlobeAid
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                        <li>
                            <a
                                href="#home"
                                className="font-medium hover:text-indigo-500 hover:-translate-y-0.5 transition-all text-sm lg:text-base"
                                onClick={(e) => handleScroll(e, '#home')}
                                aria-label="Navigate to Home"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#about"
                                className="font-medium hover:text-indigo-500 hover:-translate-y-0.5 transition-all text-sm lg:text-base"
                                onClick={(e) => handleScroll(e, '#about')}
                                aria-label="Navigate to About Us"
                            >
                                About Us
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/"
                                className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-3 md:px-4 lg:px-6 py-2 rounded-full flex items-center gap-1 lg:gap-2 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl shadow-indigo-500/30 text-sm lg:text-base"
                                aria-label="Login or Register"
                            >
                                <span className="text-xs lg:text-sm">👤</span>
                                <span className="hidden lg:inline">Login/Register</span>
                                <span className="lg:hidden">Login</span>
                            </Link>
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
                                <a
                                    href="#home"
                                    className="block font-medium hover:text-indigo-500 transition-all py-2"
                                    onClick={(e) => {
                                        handleScroll(e, '#home');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="block font-medium hover:text-indigo-500 transition-all py-2"
                                    onClick={(e) => {
                                        handleScroll(e, '#about');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <button
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>👤</span> Login/Register
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
            <main className="pt-14 sm:pt-16 md:pt-20">
                {/* Hero Section */}
                <section id="home" className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div
                            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201000%201000%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22a%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23fff%22%20stop-opacity%3D%220.1%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23fff%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3C%2Fdefs%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%22100%22%20fill%3D%22url(%23a)%22%2F%3E%3Ccircle%20cx%3D%22800%22%20cy%3D%22300%22%20r%3D%22150%22%20fill%3D%22url(%23a)%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%22700%22%20r%3D%22120%22%20fill%3D%22url(%23a)%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-center animate-float bg-cover"
                        ></div>
                    </div>
                    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fadeInUp leading-tight">
                            Your Cultural Bridge to Belonging Anywhere
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 md:mb-10 animate-fadeInUp animate-delay-200 max-w-3xl mx-auto leading-relaxed">
                            Supporting students, expats, immigrants, and tourists with AI-powered cultural and emotional guidance.
                        </p>
                        <a
                            href="#get-started"
                            onClick={(e) => handleScroll(e, '#get-started')}
                            className="bg-white/20 text-white border-2 border-white px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold inline-block hover:bg-white hover:text-indigo-500 hover:-translate-y-1 transition-all shadow-lg backdrop-blur animate-fadeInUp animate-delay-400"
                            aria-label="Start Your Journey"
                        >
                            Start Your Journey
                        </a>
                    </div>
                </section>

                {/* Get Started Section */}
                <section id="get-started" className="bg-indigo-50 py-8 sm:py-12 md:py-16 text-center">
                    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-indigo-600">Start Your Journey</h2>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">Select your country or audience to receive tailored support and tools.</p>
                    </div>
                </section>

                {/* Countries Section */}
                <section id="countries" className="bg-white py-8 sm:py-12 md:py-16">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent">Choose Your Destination</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">Select the country you're exploring to get personalized cultural insights and support</p>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-6 sm:mt-8">
                            {countries.map((country) => (
                                <div
                                    key={country.id}
                                    className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg hover:-translate-y-2 md:hover:-translate-y-3 hover:shadow-xl hover:border-indigo-500 border-2 border-transparent transition-all cursor-pointer"
                                    onClick={() => selectCountry(country.id)}
                                    role="button"
                                    aria-label={`Select ${country.name}`}
                                >
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">{country.flag}</div>
                                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1 sm:mb-2">{country.name}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{country.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-gradient-to-br from-gray-50 to-gray-200 py-10 sm:py-16 md:py-20">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent">How GlobeAid Helps You</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed">Comprehensive support powered by AI and human insight</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-6 sm:mt-8 md:mt-12">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-700"></div>
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6">{feature.icon}</div>
                                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Audience Section */}
                <section className="bg-white py-10 sm:py-16 md:py-20">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent">Made For Your Journey</h2>
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8 md:mb-12">
                            {Object.keys(audienceContent).map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-1 sm:py-2 md:py-3 lg:py-4 rounded-full border-2 border-indigo-500 font-medium transition-all text-xs sm:text-sm md:text-base ${activeTab === tab ? 'bg-indigo-500 text-white' : 'text-indigo-500 hover:bg-indigo-500 hover:text-white'}`}
                                    onClick={() => setActiveTab(tab)}
                                    aria-label={`Select ${tab} audience`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg text-center">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">{audienceContent[activeTab].title}</h3>
                            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">{audienceContent[activeTab].content}</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="bg-gradient-to-br from-indigo-500 to-purple-700 py-10 sm:py-16 md:py-20 text-white">
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4">What Our Community Says</h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 text-center mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed">Real stories from people who found their place with GlobeAid</p>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:-translate-y-2 transition-all">
                                    <p className="italic mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">{testimonial.text}</p>
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center text-lg sm:text-xl md:text-2xl flex-shrink-0">{testimonial.avatar}</div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-xs sm:text-sm md:text-base">{testimonial.author}</h4>
                                            <p className="text-xs sm:text-xs md:text-sm opacity-80">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="bg-gray-50 py-8 sm:py-12 md:py-16 text-center">
                    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-indigo-600">About GlobeAid</h2>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">GlobeAid bridges cultural gaps with AI-powered tools and community support. We empower global citizens to adapt, connect, and thrive across borders.</p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8">
                <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="pt-4 sm:pt-6 md:pt-8 border-t border-gray-800 text-center text-gray-500">
                        <p className="text-xs sm:text-sm md:text-base">© 2025 GlobeAid. All rights reserved. Built with ❤️ for global citizens.</p>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-delay-400 {
          animation-delay: 0.4s;
        }

        /* Custom breakpoints */
        @media (min-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .min-h-[60vh] {
            min-height: 50vh !important;
          }
          .text-2xl {
            font-size: 1.5rem !important;
          }
          .text-sm {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
        </div>
    );
};

export default HomePage;