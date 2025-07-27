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



const UserDashboard = ({ user, setUser , openChatPopup }) => {
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
                console.log("req", res.data)
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
                    {/* <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" /> */}
                    {/* <span>{service.rating}</span> */}
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

            // ✅ Optionally update the request's status in-place
            setServiceRequests(prev =>
                prev.map(r => r._id === req._id ? { ...r, status: 'accepted' } : r)
            );

            await refreshUserStats();

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

    const refreshUserStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);  // this assumes you're passing setUser from parent or managing user state locally
        } catch (err) {
            console.error("❌ Failed to refresh user stats:", err);
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Your Services */}
                    <div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full max-h-[500px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Globe className="w-6 h-6 mr-3 text-blue-600" />
                                    Your TimeBank Services
                                </h2>

                            </div>
                            <div className="space-y-4 overflow-y-auto pr-2" style={{ flex: 1 }}>
                                {services.map(service => (<ServiceCard key={service._id} service={service} />))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Services You've Requested */}
                    {requestedServices.length > 0 && (
                        <div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full max-h-[500px] flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <Clock className="w-6 h-6 mr-3 text-emerald-600" />
                                        Services You've Requested
                                    </h2>

                                </div>

                                <div className="space-y-4 overflow-y-auto pr-2" style={{ flex: 1 }}>
                                    {requestedServices.map(req => (
                                        <div key={req._id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
                                            {/* Header with Status */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                                        {req.service.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                                                            {req.service.category}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{req.service.duration}h</span>
                                                        <span>•</span>
                                                        <span>{req.service.location}</span>
                                                    </div>
                                                </div>

                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ml-3
      ${req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                            'bg-red-100 text-red-700 border border-red-200'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5
        ${req.status === 'pending' ? 'bg-amber-400' :
                                                            req.status === 'accepted' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Provider Info & Description in one row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-medium text-blue-600">
                                                            {(req.service.username || req.service.user?.name || "U").charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {req.service.username || req.service.user?.name || "Unknown Provider"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleCancelRequest(req._id)}
                                                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => openChatPopup(req.service.user, req.service.username)}
                                                    className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center space-x-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.993L3 20l1.993-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                                    </svg>
                                                    <span>Chat</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
                        Recent Activity
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

            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Service Requests
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                "{selectedService.title}"
                            </p>
                        </div>

                        {/* Content */}
                        <div className="max-h-96 overflow-y-auto">
                            {serviceRequests.length > 0 ? (
                                <div className="p-6 space-y-4">
                                    {serviceRequests.map((req) => (
                                        <div key={req._id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            {/* User Info */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {(req.requester?.name || "U").charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {req.requester?.name || "Unknown User"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : req.status === "accepted"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {req.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req)}
                                                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleDecline(req._id)}
                                                            className="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        openChatPopup(req.requester._id, req.requester.name);
                                                        setIsModalOpen(false);
                                                    }}
                                                    className={`px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors ${req.status === "pending" ? "flex-none" : "flex-1"
                                                        }`}
                                                >
                                                    Chat
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8-4 4-4-4m0 0L9 9l-4-4" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        No requests yet for this service.
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Requests will appear here when users are interested.
                                    </p>
                                </div>
                            )}
                        </div>
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
