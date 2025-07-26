import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import travelImage from '../assets/images/image2.jpg';

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

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showCountryPopup, setShowCountryPopup] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showMoreCountries, setShowMoreCountries] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
        { flag: "🇵🇸", name: "Palestine", description: "Connect with Palestinian culture, resilience, and community life", id: "palestine" },
        { flag: "🇱🇧", name: "Lebanon", description: "Experience Lebanese hospitality, heritage, and vibrant culture", id: "lebanon" },
        { flag: "🇺🇸", name: "United States", description: "Navigate American culture, education, and social norms", id: "usa" },
        { flag: "🇬🇧", name: "United Kingdom", description: "Discover British customs, university life, and traditions", id: "uk" },
        { flag: "🇫🇷", name: "France", description: "Immerse yourself in French language, lifestyle, and cultural etiquette", id: "france" },
        { flag: "🌍", name: "More Countries", description: "Explore our full list of supported destinations", id: "more" }
    ];

    const allCountries = [
        { flag: "🇦🇫", name: "Afghanistan", id: "afghanistan" },
        { flag: "🇦🇱", name: "Albania", id: "albania" },
        { flag: "🇩🇿", name: "Algeria", id: "algeria" },
        { flag: "🇦🇷", name: "Argentina", id: "argentina" },
        { flag: "🇦🇲", name: "Armenia", id: "armenia" },
        { flag: "🇦🇺", name: "Australia", id: "australia" },
        { flag: "🇦🇹", name: "Austria", id: "austria" },
        { flag: "🇦🇿", name: "Azerbaijan", id: "azerbaijan" },
        { flag: "🇧🇭", name: "Bahrain", id: "bahrain" },
        { flag: "🇧🇩", name: "Bangladesh", id: "bangladesh" },
        { flag: "🇧🇾", name: "Belarus", id: "belarus" },
        { flag: "🇧🇪", name: "Belgium", id: "belgium" },
        { flag: "🇧🇷", name: "Brazil", id: "brazil" },
        { flag: "🇧🇬", name: "Bulgaria", id: "bulgaria" },
        { flag: "🇨🇦", name: "Canada", id: "canada" },
        { flag: "🇨🇱", name: "Chile", id: "chile" },
        { flag: "🇨🇳", name: "China", id: "china" },
        { flag: "🇨🇴", name: "Colombia", id: "colombia" },
        { flag: "🇭🇷", name: "Croatia", id: "croatia" },
        { flag: "🇨🇿", name: "Czech Republic", id: "czech-republic" },
        { flag: "🇩🇰", name: "Denmark", id: "denmark" },
        { flag: "🇪🇨", name: "Ecuador", id: "ecuador" },
        { flag: "🇪🇬", name: "Egypt", id: "egypt" },
        { flag: "🇪🇪", name: "Estonia", id: "estonia" },
        { flag: "🇫🇮", name: "Finland", id: "finland" },
        { flag: "🇬🇪", name: "Georgia", id: "georgia" },
        { flag: "🇩🇪", name: "Germany", id: "germany" },
        { flag: "🇬🇭", name: "Ghana", id: "ghana" },
        { flag: "🇬🇷", name: "Greece", id: "greece" },
        { flag: "🇭🇺", name: "Hungary", id: "hungary" },
        { flag: "🇮🇸", name: "Iceland", id: "iceland" },
        { flag: "🇮🇳", name: "India", id: "india" },
        { flag: "🇮🇩", name: "Indonesia", id: "indonesia" },
        { flag: "🇮🇷", name: "Iran", id: "iran" },
        { flag: "🇮🇶", name: "Iraq", id: "iraq" },
        { flag: "🇮🇪", name: "Ireland", id: "ireland" },
        { flag: "🇮🇹", name: "Italy", id: "italy" },
        { flag: "🇯🇵", name: "Japan", id: "japan" },
        { flag: "🇯🇴", name: "Jordan", id: "jordan" },
        { flag: "🇰🇿", name: "Kazakhstan", id: "kazakhstan" },
        { flag: "🇰🇪", name: "Kenya", id: "kenya" },
        { flag: "🇰🇼", name: "Kuwait", id: "kuwait" },
        { flag: "🇱🇻", name: "Latvia", id: "latvia" },
        { flag: "🇱🇾", name: "Libya", id: "libya" },
        { flag: "🇱🇹", name: "Lithuania", id: "lithuania" },
        { flag: "🇱🇺", name: "Luxembourg", id: "luxembourg" },
        { flag: "🇲🇾", name: "Malaysia", id: "malaysia" },
        { flag: "🇲🇽", name: "Mexico", id: "mexico" },
        { flag: "🇲🇦", name: "Morocco", id: "morocco" },
        { flag: "🇳🇱", name: "Netherlands", id: "netherlands" },
        { flag: "🇳🇿", name: "New Zealand", id: "new-zealand" },
        { flag: "🇳🇬", name: "Nigeria", id: "nigeria" },
        { flag: "🇳🇴", name: "Norway", id: "norway" },
        { flag: "🇵🇰", name: "Pakistan", id: "pakistan" },
        { flag: "🇵🇪", name: "Peru", id: "peru" },
        { flag: "🇵🇭", name: "Philippines", id: "philippines" },
        { flag: "🇵🇱", name: "Poland", id: "poland" },
        { flag: "🇵🇹", name: "Portugal", id: "portugal" },
        { flag: "🇶🇦", name: "Qatar", id: "qatar" },
        { flag: "🇷🇴", name: "Romania", id: "romania" },
        { flag: "🇷🇺", name: "Russia", id: "russia" },
        { flag: "🇸🇦", name: "Saudi Arabia", id: "saudi-arabia" },
        { flag: "🇷🇸", name: "Serbia", id: "serbia" },
        { flag: "🇸🇬", name: "Singapore", id: "singapore" },
        { flag: "🇸🇰", name: "Slovakia", id: "slovakia" },
        { flag: "🇸🇮", name: "Slovenia", id: "slovenia" },
        { flag: "🇿🇦", name: "South Africa", id: "south-africa" },
        { flag: "🇰🇷", name: "South Korea", id: "south-korea" },
        { flag: "🇪🇸", name: "Spain", id: "spain" },
        { flag: "🇱🇰", name: "Sri Lanka", id: "sri-lanka" },
        { flag: "🇸🇪", name: "Sweden", id: "sweden" },
        { flag: "🇨🇭", name: "Switzerland", id: "switzerland" },
        { flag: "🇸🇾", name: "Syria", id: "syria" },
        { flag: "🇹🇭", name: "Thailand", id: "thailand" },
        { flag: "🇹🇳", name: "Tunisia", id: "tunisia" },
        { flag: "🇹🇷", name: "Turkey", id: "turkey" },
        { flag: "🇦🇪", name: "UAE", id: "uae" },
        { flag: "🇺🇦", name: "Ukraine", id: "ukraine" },
        { flag: "🇺🇾", name: "Uruguay", id: "uruguay" },
        { flag: "🇻🇪", name: "Venezuela", id: "venezuela" },
        { flag: "🇻🇳", name: "Vietnam", id: "vietnam" },
        { flag: "🇾🇪", name: "Yemen", id: "yemen" }
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

    const selectCountry = (country) => {
        if (country.id === "more") {
            setShowMoreCountries(true);
        } else {
            setSelectedCountry(country);
            setShowCountryPopup(true);
        }
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

    const filteredCountries = allCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const CountryPopup = ({ country, onClose }) => {
    const popupRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!country) return null;

    // Country-specific data
    const countryData = {
        palestine: {
            language: "Arabic is the primary language; English is understood in major cities and by youth.",
            communication: "Use respectful titles like 'Abu' (father of) or 'Umm' (mother of) when referring to elders.",
            culture: "Hospitality is a deep cultural value — guests are treated like family.",
            etiquette: "Dress modestly, especially in conservative or religious areas (e.g. Hebron, East Jerusalem). Fridays are holy; many businesses close midday.",
            dailyLife: [
                "Tap water isn't always safe to drink — bottled water is recommended.",
                "Cash is commonly used, especially outside cities — carry small bills in shekels.",
                "Electricity outages may occur, especially in Gaza and some West Bank towns."
            ],
            safety: [
                "Political tensions can rise quickly — avoid protests or large gatherings.",
                "Check local news or apps (like RedAlert) for area-specific updates.",
                "Entry/exit to different areas (e.g. Jerusalem, Ramallah) may involve checkpoints."
            ],
            healthcare: [
                "Basic healthcare is available, but private clinics offer better services.",
                "Pharmacies are widespread and provide over-the-counter meds without prescriptions."
            ],
            transport: [
                "Use 'service' taxis (shared taxis with fixed routes).",
                "Uber/Bolt are not available — local taxis or arranged transport are best."
            ]
        },
        // ... other country data (usa, uk, france, lebanon) ...
    };

    const data = countryData[country.id] || {
        language: "Explore the rich cultural heritage, customs, and social norms of this country.",
        communication: "Learn about local communication styles and etiquette.",
        culture: "Discover the unique cultural aspects of this destination.",
        etiquette: "Understand the do's and don'ts of social interactions.",
        dailyLife: [
            "Information about daily life and practical matters.",
            "Tips for navigating local customs and services."
        ],
        safety: [
            "General safety information and emergency contacts.",
            "Local laws and customs to be aware of."
        ],
        healthcare: [
            "Healthcare system overview and emergency services.",
            "Pharmacy availability and insurance information."
        ],
        transport: [
            "Public transportation options and tips.",
            "Local taxi services and ride-sharing availability."
        ]
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 pt-24 pb-8 md:pt-20 md:pb-12">
            <div 
                ref={popupRef}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[78vh] md:max-h-[72vh] overflow-y-auto shadow-2xl animate-fadeInUp my-6"
            >
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">{country.flag}</span>
                        {country.name}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close popup"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-indigo-600">Language & Communication</h4>
                        <p className="text-gray-700 mb-2">{data.language}</p>
                        <p className="text-gray-700">{data.communication}</p>
                    </div>
                    
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-indigo-600">Culture & Etiquette</h4>
                        <p className="text-gray-700 mb-2">{data.culture}</p>
                        <p className="text-gray-700">{data.etiquette}</p>
                    </div>
                    
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-indigo-600">Daily Life</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {data.dailyLife.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2 text-indigo-600">Safety & Politics</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {data.safety.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-2 text-indigo-600">Healthcare</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {data.healthcare.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="md:col-span-2">
                            <h4 className="text-lg font-semibold mb-2 text-indigo-600">Transport</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {data.transport.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3">Need specific advice about {country.name}?</h4>
                        <Link 
                            to={`/chat?country=${country.id}`}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 hover:shadow-lg transition-all"
                            onClick={onClose}
                        >
                            Chat with our AI Guide
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MoreCountriesPopup = ({ countries, onSelect, onClose }) => {
    const popupRef = useRef(null);
    const searchInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Focus the input when the popup opens
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-20">
            <div 
                ref={popupRef}
                className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-fadeInUp"
            >
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Select a Country</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close popup"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="p-4">
                    <div className="relative mb-4">
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Search countries..."
                            className="w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.preventDefault();
                            }}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                    </div>
                    
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {filteredCountries.map(country => (
                            <div 
                                key={country.id}
                                onClick={() => {
                                    onSelect(country);
                                    setSearchTerm('');
                                }}
                                className="p-3 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
                            >
                                <span className="text-2xl">{country.flag}</span>
                                <span>{country.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
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

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 py-2 sm:py-3 md:py-4 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md border-b border-indigo-100' : 'bg-white/95 backdrop-blur border-b border-white/20'}`}>
                <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
                        🌍 GlobeAid
                    </div>
                    
                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                        <li>
                            <a
                                href="#home"
                                className="font-medium hover:text-indigo-500 hover:-translate-y-0.5 transition-all text-sm lg:text-base relative group"
                                onClick={(e) => handleScroll(e, '#home')}
                                aria-label="Navigate to Home"
                            >
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all group-hover:w-full"></span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#about"
                                className="font-medium hover:text-indigo-500 hover:-translate-y-0.5 transition-all text-sm lg:text-base relative group"
                                onClick={(e) => handleScroll(e, '#about')}
                                aria-label="Navigate to About Us"
                            >
                                About Us
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all group-hover:w-full"></span>
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/loginandregister"
                                className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-3 md:px-4 lg:px-6 py-2 rounded-full flex items-center gap-1 lg:gap-2 hover:-translate-y-0.5 hover:scale-105 transition-all shadow-lg hover:shadow-xl shadow-indigo-500/30 text-sm lg:text-base relative overflow-hidden group"
                                aria-label="Login or Register"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-xs lg:text-sm relative z-10">👤</span>
                                <span className="hidden lg:inline relative z-10">Login/Register</span>
                                <span className="lg:hidden relative z-10">Login</span>
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
                                <Link
                                    to="/loginandregister"
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>👤</span> Login/Register
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            <main className="relative z-10">
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
                                    onClick={() => selectCountry(country)}
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

                    {/* Country Info Popup */}
                    {showCountryPopup && (
                        <CountryPopup 
                            country={selectedCountry} 
                            onClose={() => setShowCountryPopup(false)} 
                        />
                    )}

                    {/* More Countries Popup */}
                    {showMoreCountries && (
                        <MoreCountriesPopup 
                            countries={allCountries} 
                            onSelect={(country) => {
                                setShowMoreCountries(false);
                                setSelectedCountry(country);
                                setShowCountryPopup(true);
                                setSearchTerm('');
                            }}
                            onClose={() => {
                                setShowMoreCountries(false);
                                setSearchTerm('');
                            }}
                        />
                    )}
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
                <LazySection
                    fallback={<SectionSkeleton height="h-96" />}
                    className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 py-10 sm:py-16 md:py-20 text-white relative"
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4">What Our Community Says</h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 text-center mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed">Real stories from people who found their place with GlobeAid</p>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:-translate-y-2 transition-all group animate-fadeInUp"
                                     style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl md:rounded-2xl"></div>
                                    <p className="italic mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg leading-relaxed relative z-10">{testimonial.text}</p>
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center text-lg sm:text-xl md:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{testimonial.avatar}</div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-xs sm:text-sm md:text-base">{testimonial.author}</h4>
                                            <p className="text-xs sm:text-xs md:text-sm opacity-80">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                    animation: fadeInUp 0.3s ease-out forwards;
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
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                ::-webkit-scrollbar-thumb {
                    background-color: rgba(79, 70, 229, 0.5);
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(79, 70, 229, 0.7);
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