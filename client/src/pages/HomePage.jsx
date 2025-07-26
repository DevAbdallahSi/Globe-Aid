import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import travelImage from '../assets/images/image2.jpg';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

// Lazy load heavy components
const AgentChatWidget = lazy(() => import('../components/AgentChatWidget'));

// Loading skeleton component
const SectionSkeleton = ({ height = "h-64" }) => (
    <div className={`${height} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl`}>
        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
);

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, {
            threshold: 0.1,
            rootMargin: '50px',
            ...options
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasIntersected]);

    return [ref, isIntersecting, hasIntersected];
};

// Lazy loaded section wrapper
const LazySection = ({ children, fallback, className = "" }) => {
    const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

    return (
        <div ref={ref} className={className}>
            {hasIntersected ? children : fallback}
        </div>
    );
};

const HomePage = ({ isLoggedIn, user }) => {
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

    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedback, setFeedback] = useState({
        author: '',
        role: '',
        text: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [allFeedback, setAllFeedback] = useState([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/feedback');
                setAllFeedback(res.data);
            } catch (err) {
                console.error('Failed to load feedback:', err);
            }
        };

        fetchFeedback();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userFeedbackCount = allFeedback.filter(fb => fb.author === feedback.author).length;
        if (userFeedbackCount >= 2) {
            alert("You can only submit up to 2 feedback messages.");
            return;
        }


        if (!feedback.text || !feedback.author) return;

        setSubmitting(true);

        try {
            // Submit to backend
            const res = await axios.post('http://localhost:8000/api/feedback', feedback);

            // Append new feedback to the display list
            setAllFeedback((prev) => [res.data, ...prev]);

            // Reset form
            setFeedback({
                author: '',
                role: '',
                text: ''
            });

            setShowFeedbackForm(false);
        } catch (err) {
            console.error(err);
            alert('Failed to submit feedback.');
        } finally {
            setSubmitting(false);
        }
    };




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

    return (
        <div className="font-sans text-gray-800 min-h-screen overflow-x-hidden relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-96 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Cultural Pattern Overlay */}
            <div className="fixed inset-0 opacity-5 pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='2'/%3E%3Ccircle cx='15' cy='45' r='2'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}>
            </div>

            

            <main className="pt-14 sm:pt-16 md:pt-20 relative z-10">
                {/* Hero Section */}
                <section id="home" className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={travelImage}
                            alt="travel"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-pink-900/70"></div>
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fadeInUp leading-tight">
                            Your Cultural Bridge to Belonging Anywhere
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 md:mb-10 animate-fadeInUp animate-delay-200 max-w-3xl mx-auto leading-relaxed">
                            Supporting students, expats, immigrants, and tourists with AI-powered cultural and emotional guidance.
                        </p>
                    </div>
                </section>

                {/* Get Started Section */}
                <LazySection
                    fallback={<SectionSkeleton height="h-32" />}
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 sm:py-12 md:py-16 text-center relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 via-transparent to-purple-100/20"></div>
                    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6 relative z-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Start Your Journey</h2>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">Select your country or audience to receive tailored support and tools.</p>
                    </div>
                </LazySection>

                {/* Countries Section */}
                <LazySection
                    fallback={<SectionSkeleton height="h-96" />}
                    className="bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 py-8 sm:py-12 md:py-16 relative"
                >
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Choose Your Destination</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">Select the country you're exploring to get personalized cultural insights and support</p>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-6 sm:mt-8">
                            {countries.map((country, index) => (
                                <div
                                    key={country.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg hover:-translate-y-2 md:hover:-translate-y-3 hover:shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-500 border-2 border-transparent transition-all cursor-pointer group animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onClick={() => selectCountry(country.id)}
                                    role="button"
                                    aria-label={`Select ${country.name}`}
                                >
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">{country.flag}</div>
                                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors">{country.name}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{country.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </LazySection>

                {/* Features Section */}
                <LazySection
                    fallback={<SectionSkeleton height="h-96" />}
                    className="bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-10 sm:py-16 md:py-20 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">How GlobeAid Helps You</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed">Comprehensive support powered by AI and human insight</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-6 sm:mt-8 md:mt-12">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden group animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform relative z-10">{feature.icon}</div>
                                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 relative z-10">{feature.title}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed relative z-10">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </LazySection>

                {/* Audience Section */}
                <LazySection
                    fallback={<SectionSkeleton height="h-80" />}
                    className="bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 py-10 sm:py-16 md:py-20 relative"
                >
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Made For Your Journey</h2>
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8 md:mb-12">
                            {Object.keys(audienceContent).map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-1 sm:py-2 md:py-3 lg:py-4 rounded-full border-2 border-indigo-500 font-medium transition-all text-xs sm:text-sm md:text-base relative overflow-hidden group ${activeTab === tab ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-indigo-500 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white'}`}
                                    onClick={() => setActiveTab(tab)}
                                    aria-label={`Select ${tab} audience`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="max-w-5xl mx-auto bg-gradient-to-br from-white/80 via-gray-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg text-center border border-white/20">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{audienceContent[activeTab].title}</h3>
                            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">{audienceContent[activeTab].content}</p>
                        </div>
                    </div>
                </LazySection>

                {/* Testimonials Section */}
                {/* Testimonials Section with Slider */}
<LazySection
    fallback={<SectionSkeleton height="h-96" />}
    className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 py-10 sm:py-16 md:py-20 text-white relative"
>
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4">
            What Our Community Says
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 text-center mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed">
            Real stories from people who found their place with GlobeAid
        </p>
        
        {/* Slider Container */}
        <div className="relative mt-6 sm:mt-8 md:mt-12">
            {/* Navigation Buttons */}
            <button
                onClick={() => {
                    const slider = document.getElementById('testimonials-slider');
                    slider.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/30"
                aria-label="Previous testimonials"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button
                onClick={() => {
                    const slider = document.getElementById('testimonials-slider');
                    slider.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/30"
                aria-label="Next testimonials"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slider Track */}
            <div
                id="testimonials-slider"
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-12 scrollbar-hide"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                }}
            >
                {allFeedback.map((fb, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2 hover:shadow-2xl relative flex flex-col justify-between min-w-[300px] max-w-[300px] min-h-[320px] overflow-hidden flex-shrink-0"
                    >
                        {/* Feedback Text */}
                        <p className="italic text-sm sm:text-base leading-relaxed mb-6 flex-grow break-words overflow-wrap-anywhere">
                            "{fb.text.length > 180 ? fb.text.slice(0, 180) + '…' : fb.text}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-xl border border-white/20 flex-shrink-0">
                                {fb.avatar || '👤'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-base break-words">{fb.author}</h4>
                                <p className="text-sm text-white/80 break-words">{fb.role}</p>
                            </div>
                        </div>

                        {/* Card Number Indicator */}
                        <div className="absolute top-4 right-4 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                        </div>
                    </div>
                ))}
                
                {/* Add more feedback prompt card */}
                {isLoggedIn && (
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-dashed border-white/30 transition-all duration-300 hover:bg-white/10 hover:border-white/50 relative flex flex-col items-center justify-center min-w-[300px] max-w-[300px] min-h-[320px] overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => setShowFeedbackForm(true)}
                    >
                        <div className="text-6xl mb-4 opacity-60">✍️</div>
                        <h4 className="font-semibold text-lg mb-2 text-center">Share Your Story</h4>
                        <p className="text-sm text-white/80 text-center leading-relaxed">
                            Help others by sharing your experience with GlobeAid
                        </p>
                        <div className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                            Add Feedback
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll Indicator Dots */}
            <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: Math.min(allFeedback.length, 5) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const slider = document.getElementById('testimonials-slider');
                            slider.scrollTo({ left: i * 320, behavior: 'smooth' });
                        }}
                        className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-colors"
                        aria-label={`Go to testimonial ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    </div>

    {/* Fixed Add Feedback Button (Alternative) */}
    {isLoggedIn && (
        <button
            onClick={() => setShowFeedbackForm(true)}
            className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20"
            aria-label="Add Feedback"
        >
            ✍️ Add Feedback
        </button>
    )}
</LazySection>

                {/* About Section */}
                <LazySection
                    fallback={<SectionSkeleton height="h-48" />}
                    className="bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-8 sm:py-12 md:py-16 text-center relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 relative z-10">
                        <h2 id="about" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">About GlobeAid</h2>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">GlobeAid bridges cultural gaps with AI-powered tools and community support. We empower global citizens to adapt, connect, and thrive across borders.</p>
                    </div>
                </LazySection>

                {/* Floating Agent Chat Widget */}
                <Suspense fallback={
                    <div className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
                }>
                    <div className="fixed bottom-6 right-6 z-50">
                        <AgentChatWidget />
                    </div>
                </Suspense>
                {showFeedbackForm && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-6">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 animate-fadeInUp"
                        >
                            <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">We’d Love Your Feedback ✍️</h2>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                    value={feedback.author}
                                    onChange={(e) => setFeedback({ ...feedback, author: e.target.value })}
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Your Role (optional)"
                                    className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                    value={feedback.role}
                                    onChange={(e) => setFeedback({ ...feedback, role: e.target.value })}
                                />

                                <textarea
                                    placeholder="Your feedback..."
                                    className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                    rows={4}
                                    value={feedback.text}
                                    onChange={(e) => setFeedback({ ...feedback, text: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowFeedbackForm(false)}
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </main>

            <style>{`
                body {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(-180deg); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(90deg); }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float-delayed 25s ease-in-out infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 30s ease-in-out infinite;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animate-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                .animate-gradient {
                    background-size: 400% 400%;
                    animation: gradient 3s ease infinite;
                }

                /* Glassmorphism effects */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                }
                
                .backdrop-blur {
                    backdrop-filter: blur(12px);
                }

                /* Enhanced scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #4f46e5, #7c3aed);
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

                /* Loading animations */
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                /* Enhanced hover effects */
                .group:hover .group-hover\\:scale-110 {
                    transform: scale(1.1);
                }
                
                .group:hover .group-hover\\:opacity-100 {
                    opacity: 1;
                }
                
                .group:hover .group-hover\\:text-indigo-600 {
                    color: rgb(79 70 229);
                }

                /* Smooth transitions for all interactive elements */
                * {
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 300ms;
                }

                /* Enhanced focus states for accessibility */
                button:focus,
                a:focus {
                    outline: 2px solid rgb(99 102 241);
                    outline-offset: 2px;
                    border-radius: 4px;
                }

                /* Improved text rendering */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div>
    );
};

export default HomePage;