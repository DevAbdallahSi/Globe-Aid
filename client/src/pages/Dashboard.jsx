import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    MessageCircle,
    Clock,
    Users,
    Heart,
    Globe,
    Wifi,
    WifiOff,
    Plus,
    TrendingUp,
    Star,
    Calendar,
    MapPin,
    ChevronRight
} from 'lucide-react';
import AgentChatWidget from '../components/AgentChatWidget';
import ChatBox from '../components/ChatBox';
import { User } from 'lucide-react';



const UserDashboard = ({ user, openChatPopup }) => {
    const [isOnline, setIsOnline] = useState(true);

    const [chatWith, setChatWith] = useState(null);


    const [selectedService, setSelectedService] = useState(null);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [requestedServices, setRequestedServices] = useState([]);

    const navigate = useNavigate();

    if (!user) {
        return <div className="text-center mt-10 text-gray-500">Loading dashboard...</div>;
    }

    const [stats] = useState({
        chatCount: 47,
        servicesOffered: 8,
        helpedUsers: 23,
        hoursContributed: 156
    });



    const [recentActivity] = useState([
        { type: "chat", message: "Helped Maria with visa questions", time: "2 hours ago" },
        { type: "service", message: "New request for German practice", time: "5 hours ago" },
        { type: "achievement", message: "Reached 150 hours milestone!", time: "1 day ago" }
    ]);


    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchUserServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/services/mine', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setServices(res.data);
            } catch (error) {
                console.error('Failed to fetch user services:', error);
            }
        };


        const fetchRequestedServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/services/requested', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRequestedServices(res.data);
                console.log("req",res.data)
            } catch (err) {
                console.error("Failed to fetch requested services:", err);
            }
        };

        if (user) {
            fetchUserServices();
            fetchRequestedServices();
        }
    }, [user]);





    const handleCancelRequest = async (requestId) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/services/request/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequestedServices(prev => prev.filter(req => req._id !== requestId));
        } catch (err) {
            console.error("Failed to cancel request:", err);
            alert("Failed to cancel request");
        }
    };



    const handleServiceClick = async (service) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8000/api/services/requests/${service._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSelectedService(service);
            setServiceRequests(res.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch requests for this service:', error);
        }
    };


    const StatCard = ({ icon: Icon, label, value, trend, color = "blue" }) => (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100 group-hover:from-${color}-100 group-hover:to-${color}-200 transition-all duration-300`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                {trend && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{trend}%
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
        </div>
    );

    const ServiceCard = ({ service }) => (
        <div onClick={() => handleServiceClick(service)} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                {service.requests?.length > 0 ? (
                    <span className="text-blue-600 underline cursor-pointer" >
                        {service.requests.length} requests
                    </span>
                ) : (
                    <span className="text-gray-400">0 requests</span>
                )}
                <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span>{service.rating}</span>
                </div>
            </div>
        </div>
    );

    const handleOfferClick = () => {
        navigate('/timebank?tab=offer');
    };
    const handleApprove = async (req) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/services/request/${req._id}`,
                { status: 'accepted' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove it from the modal list
            setServiceRequests(prev => prev.filter(r => r._id !== req._id));

            // Start chat
            setChatWith(req.requester);
            setIsModalOpen(false);
        } catch (err) {
            console.error("❌ Approve failed", err);
            alert("Failed to approve request");
        }
    };



    const handleDecline = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/services/request/${requestId}`,
                { status: 'declined' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setServiceRequests(prev => prev.filter(r => r._id !== requestId));
        } catch (err) {
            console.error("❌ Decline failed", err);
            alert("Failed to decline request");
        }
    };




    if (!user) return <div className="text-center mt-10 text-gray-500">Loading dashboard...</div>;
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6 relative">
            {/* Floating Agent Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                <AgentChatWidget />
            </div>

            {/* Header */}
            <div className="max-w-7xl mx-auto mt-8 mb-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg bg-white flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-600" />
                                </div>

                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                                    {isOnline ? <Wifi className="w-3 h-3 text-white" /> : <WifiOff className="w-3 h-3 text-white" />}
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👋</h1>
                                <div className="flex flex-wrap items-center gap-3 text-gray-600 mt-2">
                                    <div className="flex items-center text-sm">
                                        <MapPin className="w-4 h-4 mr-1" />{user?.country || "Unknown"}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Calendar className="w-4 h-4 mr-1" />Member since {user?.createdAt?.slice(0, 10) || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} transition-all duration-300`}>
                            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                            <span className="text-sm font-medium">{isOnline ? 'Connected' : 'Reconnecting...'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <button onClick={() => navigate('/deepseek')}
                        className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-6 md:p-8 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="text-xl md:text-2xl font-bold mb-2">Launch AI Chat</h3>
                                <p className="text-blue-100 text-sm md:text-base">Get instant help and support</p>
                            </div>
                            <MessageCircle className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform" />
                        </div>
                    </button>

                    <button onClick={handleOfferClick}
                        className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl p-6 md:p-8 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="text-xl md:text-2xl font-bold mb-2">Offer Services</h3>
                                <p className="text-emerald-100 text-sm md:text-base">Share your knowledge & earn time credits</p>
                            </div>
                            <Plus className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform" />
                        </div>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <StatCard icon={MessageCircle} label="Chat Sessions" value={stats.chatCount} trend={12} color="blue" />
                    <StatCard icon={Heart} label="Services Offered" value={stats.servicesOffered} trend={25} color="emerald" />
                    <StatCard icon={Users} label="People Helped" value={stats.helpedUsers} trend={8} color="purple" />
                    <StatCard icon={Clock} label="Hours Contributed" value={stats.hoursContributed} trend={15} color="orange" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Globe className="w-6 h-6 mr-3 text-blue-600" />Your TimeBank Services
                                </h2>
                                <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors text-sm font-medium">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {services.map(service => (<ServiceCard key={service._id} service={service} />))}
                            </div>
                        </div>
                    </div>

                    {requestedServices.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Services You've Requested</h2>
                            <div className="space-y-4">
                                {requestedServices.map(req => (
                                    <div key={req._id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-gray-900 font-semibold">{req.service.title}</h3>
                                                <p className="text-sm text-gray-500">{req.service.category}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${req.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : req.status === 'accepted'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-2">{req.service.description}</p>

                                        <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-3">
                                            <span>Duration: {req.service.duration}h</span>
                                            <span>Location: {req.service.location}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() => handleCancelRequest(req._id)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Cancel Request
                                            </button>
                                            <button
                                                onClick={() => openChatPopup(req.service.user, req.service.username)}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                Open Chat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <TrendingUp className="w-6 h-6 mr-3 text-green-600" />Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'chat' ? 'bg-blue-500' : activity.type === 'service' ? 'bg-green-500' : 'bg-purple-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">Community Impact</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-purple-100">Global Reach</span>
                                    <span className="font-bold">12 Countries</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-purple-100">Languages</span>
                                    <span className="font-bold">5 Supported</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-purple-100">Community Rank</span>
                                    <span className="font-bold">Top 15%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">Requests for "{selectedService.title}"</h2>
                        {serviceRequests.length > 0 ? (
                            <ul className="space-y-3">
                                {serviceRequests.map((req) => (
                                    <li key={req._id} className="py-2 border-b">
                                        <div className="flex flex-col mb-2">
                                            <span className="font-medium text-gray-900">{req.requester?.name || "Unknown"}</span>
                                            <span className="text-sm text-gray-500">{req.requester?.email || "N/A"}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(req)}
                                                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleDecline(req._id)}
                                                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Decline
                                            </button>
                                        </div>

                                    <li
                                        key={req._id}
                                        className="flex flex-col py-2 border-b cursor-pointer hover:bg-gray-50"
                                        onClick={() => {
                                            openChatPopup(req.requester._id, req.requester.name); // ✅ pass both ID and name
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        <span className="font-medium text-gray-900">{req.requester?.name || "Unknown"}</span>
                                        <span className="text-sm text-gray-500">{req.requester?.email || "N/A"}</span>

                                    </li>
                                ))}


                            </ul>
                        ) : (
                            <p className="text-gray-500">No requests yet for this service.</p>
                        )}
                    </div>
                </div>
            )}
            {chatWith && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Chat with {chatWith.name}
                    </h2>
                    <ChatBox userId={user._id} receiverId={chatWith._id} />
                </div>
            )}

        </div>


    );
};

export default UserDashboard;
