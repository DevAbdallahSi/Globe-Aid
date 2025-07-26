import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Globe, MapPin, Settings, Clock, Trash2, Edit3, Save, X } from 'lucide-react';
import AgentChatWidget from '../components/AgentChatWidget';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate();

    const timeBankStats = {
        hoursEarned: 47.5,
        hoursSpent: 32.0,
        balance: 15.5,
        totalExchanges: 23,
        rating: 4.9,
        memberSince: 'March 2023',
    };

    // ✅ Fetch user profile on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = res.data;
                const formatted = {
                    _id: user._id,
                    name: user.name || '',
                    email: user.email || '',
                    language: user.language || 'English',
                    country: user.country ,
                    preferences: user.preferences || {
                        emailNotifications: true,
                        smsNotifications: false,
                        publicProfile: true,
                        showStats: true,
                        marketingEmails: false
                    }
                };

                setProfileData(formatted);
                setEditData(formatted);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditData(profileData);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch('http://localhost:8000/api/users/update', editData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfileData(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setEditData(profileData);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handlePreferenceChange = (preference) => {
        setEditData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [preference]: !prev.preferences[preference]
            }
        }));
    };

    const handleDeleteAccount = async () => {
        try {
            console.log("Deleting user ID:", profileData?._id);
            await axios.delete(`http://localhost:8000/api/users/${profileData._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Clean up and redirect
            localStorage.removeItem('token');
            setShowDeleteModal(false);
            navigate('/');
        } catch (err) {
            console.error('Failed to delete account:', err);
            alert('Failed to delete account. Please try again.');
        }
    };

    if (!profileData || !editData) return <div className="p-6 text-center">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <User className="mr-2 text-blue-600" size={24} /> Profile Information
                            </h2>
                            {!isEditing ? (
                                <button onClick={handleEdit} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    <Edit3 size={16} className="mr-2" /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                        <Save size={16} className="mr-2" /> Save
                                    </button>
                                    <button onClick={handleCancel} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                        <X size={16} className="mr-2" /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <AgentChatWidget />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['name', 'email', 'language', 'country'].map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                                    {isEditing ? (
                                        field === 'language' || field === 'country' ? (
                                            <select
                                                value={editData[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            >
                                                {field === 'language'
                                                    ? ['English', 'Spanish', 'French', 'German', 'Italian']
                                                    : ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France']
                                                        .map(option => <option key={option} value={option}>{option}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={field === 'email' ? 'email' : 'text'}
                                                value={editData[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        )
                                    ) : (
                                        <div className="px-3 py-2 bg-gray-50 rounded flex items-center">
                                            {(field === 'name' && <User size={16} className="mr-2" />) ||
                                                (field === 'email' && <Mail size={16} className="mr-2" />) ||
                                                (field === 'language' && <Globe size={16} className="mr-2" />) ||
                                                (field === 'country' && <MapPin size={16} className="mr-2" />)}
                                            {profileData[field]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <Settings className="mr-2 text-blue-600" size={20} /> Preferences
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(editData.preferences).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                                        <span className="text-gray-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={() => isEditing && handlePreferenceChange(key)}
                                                disabled={!isEditing}
                                                className="sr-only peer"
                                            />
                                            <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-full ${!isEditing ? 'opacity-50' : ''}`}></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Clock className="mr-2 text-green-600" size={24} /> TimeBank Stats
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between bg-green-50 px-4 py-2 rounded">
                                    <span>Hours Earned</span>
                                    <strong className="text-green-600">{timeBankStats.hoursEarned}h</strong>
                                </div>
                                <div className="flex justify-between bg-red-50 px-4 py-2 rounded">
                                    <span>Hours Spent</span>
                                    <strong className="text-red-600">{timeBankStats.hoursSpent}h</strong>
                                </div>
                                <div className="flex justify-between bg-blue-50 px-4 py-2 rounded">
                                    <span>Current Balance</span>
                                    <strong className="text-blue-600">{timeBankStats.balance}h</strong>
                                </div>
                                <div className="flex justify-between bg-gray-50 px-4 py-2 rounded">
                                    <span>Total Exchanges</span>
                                    <strong>{timeBankStats.totalExchanges}</strong>
                                </div>
                                <div className="flex justify-between bg-yellow-50 px-4 py-2 rounded">
                                    <span>Rating</span>
                                    <strong className="text-yellow-600">{timeBankStats.rating}/5.0</strong>
                                </div>
                                <p className="text-center text-sm text-gray-500">Member since {timeBankStats.memberSince}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
                            <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                <Trash2 size={16} className="mr-2" /> Delete Account
                            </button>
                            <p className="text-sm text-gray-500 mt-2 text-center">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete your account? This action cannot be undone and you will lose all your TimeBank hours and transaction history.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Delete</button>
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
