import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Globe, MapPin, Clock, Trash2, Edit3, Save, X } from 'lucide-react';
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
                    country: user.country || 'United States',
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

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${profileData._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </header>

                {/* Vertical Stack */}
                <div className="flex flex-col gap-6">
                    {/* Profile Information */}
                    <div className="w-full bg-white rounded-xl shadow-sm p-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <User className="mr-2 text-blue-600" size={24} /> Profile Information
                            </h2>
                            {!isEditing ? (
                                <button onClick={handleEdit} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Edit3 size={16} className="mr-2" /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        <Save size={16} className="mr-2" /> Save
                                    </button>
                                    <button onClick={handleCancel} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                        <X size={16} className="mr-2" /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {['name', 'email', 'language', 'country'].map((field, idx) => (
                                <div key={idx} className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-700 capitalize">{field}</label>
                                    {isEditing ? (
                                        field === 'language' || field === 'country' ? (
                                            <select
                                                value={editData[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        )
                                    ) : (
                                        <div className="px-2 py-1.5 bg-gray-50 rounded-lg flex items-center border border-gray-200">
                                            {(field === 'name' && <User size={16} className="mr-2 text-gray-500" />) ||
                                                (field === 'email' && <Mail size={16} className="mr-2 text-gray-500" />) ||
                                                (field === 'language' && <Globe size={16} className="mr-2 text-gray-500" />) ||
                                                (field === 'country' && <MapPin size={16} className="mr-2 text-gray-500" />)}
                                            <span className="text-sm text-gray-900">{profileData[field]}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <AgentChatWidget className="mt-4" />
                    </div>

                    {/* TimeBank Stats */}
                    <div className="w-full bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Clock className="mr-2 text-green-600" size={24} /> TimeBank Stats
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                                <span className="text-gray-700">Hours Earned</span>
                                <strong className="text-green-600">{timeBankStats.hoursEarned}h</strong>
                            </div>
                            <div className="flex justify-between bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                                <span className="text-gray-700">Hours Spent</span>
                                <strong className="text-red-600">{timeBankStats.hoursSpent}h</strong>
                            </div>
                            <div className="flex justify-between bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                                <span className="text-gray-700">Current Balance</span>
                                <strong className="text-blue-600">{timeBankStats.balance}h</strong>
                            </div>
                            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                                <span className="text-gray-700">Total Exchanges</span>
                                <strong className="text-gray-900">{timeBankStats.totalExchanges}</strong>
                            </div>
                            <div className="flex justify-between bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-100">
                                <span className="text-gray-700">Rating</span>
                                <strong className="text-yellow-600">{timeBankStats.rating}/5.0</strong>
                            </div>
                            <p className="text-center text-sm text-gray-500 pt-2 border-t border-gray-200">
                                Member since {timeBankStats.memberSince}
                            </p>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="w-full bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            <Trash2 size={16} className="mr-2" /> Delete Account
                        </button>
                        <p className="text-sm text-gray-500 mt-3 text-center">This action cannot be undone</p>
                    </div>
                </div>

                {/* Delete Modal */}
                {showDeleteModal && (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Delete Account</h3>
            <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and you will lose all your TimeBank hours and transaction history.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                    Yes, Delete
                </button>
                <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}
            </div>
        </div>
    );
};

export default ProfilePage;
