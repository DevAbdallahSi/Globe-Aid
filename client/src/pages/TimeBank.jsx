import React, { useState } from 'react';
import { Clock, Plus, Search, User, Calendar, Star, ArrowRight, Gift } from 'lucide-react';

const TimeBank = () => {
    const [activeTab, setActiveTab] = useState('browse');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Sample data
    const [services, setServices] = useState([
        {
            id: 1,
            title: "Guitar Lessons",
            provider: "Sarah M.",
            category: "Education",
            duration: "1 hour",
            rating: 4.8,
            description: "Beginner to intermediate guitar lessons. Acoustic or electric.",
            location: "Online or Downtown",
            avatar: "🎸"
        },
        {
            id: 2,
            title: "Home Cooking Classes",
            provider: "Maria L.",
            category: "Cooking",
            duration: "2 hours",
            rating: 5.0,
            description: "Learn to cook traditional Mediterranean dishes from scratch.",
            location: "My kitchen or yours",
            avatar: "👩‍🍳"
        },
        {
            id: 3,
            title: "Garden Design Consultation",
            provider: "Tom R.",
            category: "Gardening",
            duration: "1.5 hours",
            rating: 4.9,
            description: "Help plan and design your dream garden space.",
            location: "Your location",
            avatar: "🌱"
        },
        {
            id: 4,
            title: "Website Development",
            provider: "Alex K.",
            category: "Technology",
            duration: "3 hours",
            rating: 4.7,
            description: "Build simple websites for small businesses or personal use.",
            location: "Remote",
            avatar: "💻"
        }
    ]);

    const [timeHistory, setTimeHistory] = useState([
        { id: 1, type: "earned", service: "Tutoring Math", hours: 2, date: "2024-01-20", with: "John D." },
        { id: 2, type: "spent", service: "Car Repair", hours: 1.5, date: "2024-01-18", with: "Mike S." },
        { id: 3, type: "earned", service: "Dog Walking", hours: 1, date: "2024-01-15", with: "Lisa P." },
        { id: 4, type: "spent", service: "Language Exchange", hours: 2, date: "2024-01-12", with: "Ana M." }
    ]);

    const [userBalance] = useState(4.5); // Time credits balance

    const categories = ["all", "Education", "Cooking", "Gardening", "Technology", "Health", "Arts", "Home"];

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalEarned = timeHistory.filter(h => h.type === 'earned').reduce((sum, h) => sum + h.hours, 0);
    const totalSpent = timeHistory.filter(h => h.type === 'spent').reduce((sum, h) => sum + h.hours, 0);

    const ServiceCard = ({ service }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        {service.avatar}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {service.provider}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center text-yellow-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1">{service.rating}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {service.category}
                    </span>
                </div>
            </div>

            <p className="text-gray-700 text-sm mb-4">{service.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration}
                </div>
                <div>{service.location}</div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                Request Service
                <ArrowRight className="w-4 h-4 ml-2" />
            </button>
        </div>
    );

    const HistoryItem = ({ item }) => (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
            <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {item.type === 'earned' ? '+' : '-'}
                </div>
                <div>
                    <p className="font-medium text-gray-900">{item.service}</p>
                    <p className="text-sm text-gray-600">with {item.with}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'earned' ? '+' : '-'}{item.hours}h
                </p>
                <p className="text-xs text-gray-500">{item.date}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">TimeBank</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Your Balance</p>
                                <p className="font-bold text-blue-600">{userBalance} hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Current Balance</p>
                                <p className="text-2xl font-bold text-blue-600">{userBalance}h</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hours Earned</p>
                                <p className="text-2xl font-bold text-green-600">{totalEarned}h</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Gift className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hours Spent</p>
                                <p className="text-2xl font-bold text-red-600">{totalSpent}h</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <ArrowRight className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
                    {[
                        { key: 'browse', label: 'Browse Services' },
                        { key: 'offer', label: 'Offer Service' },
                        { key: 'history', label: 'History' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Browse Services Tab */}
                {activeTab === 'browse' && (
                    <div>
                        {/* Search and Filters */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>

                        {filteredServices.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No services found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Offer Service Tab */}
                {activeTab === 'offer' && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Offer a New Service</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Piano Lessons, Home Cleaning, Pet Sitting"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    {categories.slice(1).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your service, experience, and what clients can expect"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        placeholder="1.5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Online, Your location, My studio"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => alert('Service offering functionality would be implemented here')}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Offer This Service
                            </button>
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Time Exchange History</h2>
                            <div className="space-y-3">
                                {timeHistory.map(item => (
                                    <HistoryItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {timeHistory.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No time exchanges yet. Start by offering or requesting a service!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeBank;