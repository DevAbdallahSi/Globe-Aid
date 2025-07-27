import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center px-4 mb-6 md:mb-0">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 bg-clip-text text-transparent mb-1">
                            🌍 GlobeAid
                        </h3>
                        <p className="text-gray-400 text-sm leading-snug">
                            Bridging cultural gaps with AI-powered tools<br />
                            and community support
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col items-center text-center px-4 space-y-1">
                        <h4 className="text-base font-semibold">Contact Us</h4>
                        <p className="text-gray-400 text-sm">help@globeaid.com</p>
                        <p className="text-gray-400 text-sm">+970 56 929 4589</p>
                        <div className="flex justify-center space-x-4 pt-1">
                            {/* Social icons as before */}
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-800 pt-4 text-center text-gray-500 text-xs">
                    © {new Date().getFullYear()} GlobeAid. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
