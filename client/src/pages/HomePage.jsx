import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import travelImage from '../assets/images/image2.jpg';
import axios from 'axios';
// import EmojiPicker from 'emoji-picker-react';

const AgentChatWidget = lazy(() => import('../components/AgentChatWidget'));

const SectionSkeleton = ({ height = "h-64" }) => (
    <div className={`${height} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl`}>
        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
);

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
            const res = await axios.post('http://localhost:8000/api/feedback', feedback);

            setAllFeedback((prev) => [res.data, ...prev]);

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

    const selectCountry = (country) => {
        if (country.id === "more") {
            setShowMoreCountries(true);
        } else {
            setSelectedCountry(country);
            setShowCountryPopup(true);
        }
    };

    const filteredCountries = allCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const CountryPopup = ({ country, onClose }) => {
        const popupRef = useRef(null);

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
            lebanon: {
                language: "Arabic is official, but French and English are widely spoken.",
                communication: "Lebanese people are expressive — personal space is less rigid, and conversations can be loud and animated.",
                culture: "Hospitality and food are central to social life; expect generous and warm interactions.",
                etiquette: "Dress is modern in Beirut but more conservative in rural areas. Greetings are important — use both hands and kisses on the cheek (when appropriate).",
                dailyLife: [
                    "Frequent power cuts — generators are commonly used in homes and businesses.",
                    "The Lebanese lira fluctuates heavily — USD is widely accepted.",
                    "Many basic services depend on private providers, such as water and electricity."
                ],
                safety: [
                    "Avoid political protests and sensitive areas (like borders with Israel/Syria).",
                    "Stay informed via local apps and embassy alerts.",
                    "Petty theft is uncommon, but caution is still advised in crowded areas."
                ],
                healthcare: [
                    "Private hospitals (especially in Beirut) offer excellent care but can be expensive.",
                    "Emergency care is available, but travel insurance is recommended."
                ],
                transport: [
                    "No real public transit system — use shared taxis or apps like Yango, Allo Taxi.",
                    "Traffic in Beirut can be heavy; walking is best for short distances."
                ]
            },
            france: {
                language: "French is the official language and is expected in public interactions.",
                communication: "Formality is important — use 'vous' for strangers and older people, and always greet with 'Bonjour'.",
                culture: "The French take pride in food, art, and conversation — enjoy meals and social gatherings slowly and respectfully.",
                etiquette: "Say hello and goodbye when entering or leaving shops. Avoid loud behavior in public spaces.",
                dailyLife: [
                    "Shops often close for lunch (12–2 PM), and early on Sundays.",
                    "Tap water is safe to drink almost everywhere.",
                    "Public restrooms are not always free or easy to find — keep change with you."
                ],
                safety: [
                    "Pickpocketing is common in crowded tourist spots like the metro or Eiffel Tower.",
                    "Protests (manifestations) can disrupt traffic and public transit — avoid large gatherings.",
                    "Use official taxis or apps to avoid scams, especially at airports."
                ],
                healthcare: [
                    "High-quality healthcare system — public (with Carte Vitale) and private services available.",
                    "Pharmacies are well-regulated and pharmacists can provide health advice."
                ],
                transport: [
                    "Metro and buses are efficient in cities (especially Paris).",
                    "SNCF trains connect major cities — book early for better prices.",
                    "Walking and cycling are common; bike-sharing services are widely available."
                ]
            },
            uk: {
                language: "English is spoken everywhere, though regional accents (e.g., Scottish, Welsh) may vary widely.",
                communication: "British people are polite and reserved — expect indirect communication and dry humour.",
                culture: "Traditions like tea time and pub culture are strong. Queuing and respecting personal space are very important.",
                etiquette: "Be punctual. Always say 'please,' 'thank you,' and 'sorry.' Avoid overly personal questions early in relationships.",
                dailyLife: [
                    "Shops typically close early (5–6 PM) outside big cities; Sunday hours are limited.",
                    "Contactless payments and Oyster cards are widely used.",
                    "Tap water is safe to drink across the UK."
                ],
                safety: [
                    "Generally very safe, but be alert in nightlife areas after dark.",
                    "Emergency number is 999 or 112.",
                    "Always check local travel updates during rail strikes or weather disruptions."
                ],
                healthcare: [
                    "NHS offers free healthcare to residents and students. Tourists should have travel insurance.",
                    "Walk-in clinics and GP appointments are common for non-emergencies."
                ],
                transport: [
                    "Excellent train and underground networks; London has the Tube, Oyster cards for transport.",
                    "Buses are reliable; check local apps (Citymapper, Trainline).",
                    "Driving is on the **left** — roads are narrow in many towns."
                ]
            },
            usa: {
                language: "English is the primary language; Spanish is also widely spoken in many states.",
                communication: "Friendly, casual, and direct. Small talk is common in public and customer service settings.",
                culture: "Individualism and personal freedom are strong values. Cultural norms vary by region.",
                etiquette: "Tipping is expected (15–20% in restaurants). Respect personal space and privacy.",
                dailyLife: [
                    "Credit/debit card use is nearly universal — cash is rarely needed.",
                    "Open hours are flexible; many businesses operate 24/7.",
                    "Alcohol and tobacco laws vary by state — the legal drinking age is 21."
                ],
                safety: [
                    "Emergency number is 911.",
                    "Gun laws vary — avoid confrontation and stay informed about local regulations.",
                    "Urban areas are generally safe, but caution is advised at night in unfamiliar places."
                ],
                healthcare: [
                    "There is no universal healthcare — medical care is expensive.",
                    "Always have travel insurance; ER visits can cost thousands without it."
                ],
                transport: [
                    "Public transport is limited outside major cities — car rental may be necessary.",
                    "Rideshare apps like Uber and Lyft are widely used.",
                    "Cross-country travel is often by domestic flights due to large distances."
                ]
            }
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
                                to={`/GloabAid?country=${country.id}`}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 hover:shadow-lg transition-all"
                                onClick={onClose}
                            >
                                Chat with GloabAid AI Guide
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

        useEffect(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, []);

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

                {/* Countries Section */}
                <LazySection
                    fallback={<SectionSkeleton height="h-96" />}
                    className="bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 py-8 sm:py-12 md:py-16 relative"
                >
                    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Start Your Journey</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">Select your country or audience to receive tailored support and tools.</p>
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
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 text-center mb-8 sm:mb-12 md:mb-8 max-w-4xl mx-auto leading-relaxed">
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
                                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-12 pt-8 md:pt-4 scrollbar-hide"
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