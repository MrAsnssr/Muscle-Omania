import React from 'react';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => void;
    onLoginClick: () => void;
    onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, onLoginClick, onHistoryClick }) => {
    return (
        <header className="bg-black/30 backdrop-blur-lg sticky top-0 z-40 w-full border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-24">
                <div onClick={() => window.location.hash = '#home'} className="flex items-center space-x-4 cursor-pointer">
                    <img src="https://i.ibb.co/4ZmnSKy2/unnamed-1-removebg-preview.png" alt="Muscle Omania Logo" className="h-20 w-auto"/>
                    <h1 className="text-3xl font-bold text-white tracking-tight hidden sm:block">Muscle Omania</h1>
                </div>
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                         <>
                            <button onClick={onHistoryClick} className="font-semibold text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
                                History
                            </button>
                            <button 
                                onClick={onLogout} 
                                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={onLoginClick} 
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-full transition-colors uppercase tracking-wider text-sm"
                        >
                            Admin Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;