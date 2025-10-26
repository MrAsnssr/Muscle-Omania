


import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type firebase from 'firebase/compat/app';
import { onAuthStateChangedListener, logoutUser, getUserProfile, getWorkoutHistory, seedDatabase, getCategories } from './services/firebaseService';
import { firebaseConfig } from './firebaseConfig';
import type { WorkoutSession } from './types';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import WorkoutHistoryModal from './components/WorkoutHistoryModal';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import EquipmentPage from './pages/EquipmentPage';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [route, setRoute] = useState(window.location.hash);

    const fetchUserWorkoutHistory = useCallback(async () => {
        if (user) {
            const history = await getWorkoutHistory(user.uid);
            setWorkoutHistory(history);
        }
    }, [user]);

    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    useEffect(() => {
        // Initial check
        const checkDb = async () => {
            setIsLoading(true);
            setError(null);
            try {
                 if (firebaseConfig.apiKey.startsWith("[YOUR_")) {
                    throw new Error("Configuration Error: Please replace the placeholder values in 'firebaseConfig.ts' with your actual Firebase keys.");
                }
                const categories = await getCategories();
                if (categories.length === 0) {
                    await seedDatabase();
                }
            } catch (err: any) { // Use 'any' to inspect error properties like 'code'
                 console.error("Firebase initial check error:", err);
                 if (err instanceof Error && err.message.startsWith("Configuration Error:")) {
                    setError(err.message);
                } else if (err.code === 'permission-denied') {
                    setError("Firestore Permission Error: Your security rules are blocking access. This is a required setup step. Please go to your Firebase Console -> Firestore Database -> Rules tab and update your rules to allow public read access for 'categories' and 'equipment' collections.");
                }
                else {
                    setError("Could not connect to the database. Check your internet connection, Firebase configuration, and Firestore security rules.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkDb();

        const unsubscribe = onAuthStateChangedListener(async (user) => {
            setUser(user);
            setIsLoggedIn(!!user);
            if (user) {
                const profile = await getUserProfile(user.uid);
                setIsAdmin(profile?.role === 'admin');
                fetchUserWorkoutHistory();
            } else {
                setIsAdmin(false);
                setWorkoutHistory([]);
            }
        });
        return unsubscribe;
    }, [fetchUserWorkoutHistory]);

    const handleLogout = async () => {
        await logoutUser();
        window.location.hash = '#home';
    };

    const renderPage = () => {
        const hashParts = route.replace(/^#\/?/, '').split('/');
        const page = hashParts[0] || 'home';
        const param = hashParts[1];

        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><Spinner /></div>;
        }

        if (error) {
            return (
                <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg border border-red-700 max-w-2xl mx-auto">
                    <p className="font-bold text-xl">An Error Occurred</p>
                    <p className="mt-2 whitespace-pre-wrap">{error}</p>
                </div>
            );
        }

        switch (page) {
            case 'category':
                return <CategoryPage categoryId={param} isAdmin={isAdmin} />;
            case 'equipment':
                return <EquipmentPage equipmentId={param} user={user} onSessionSaved={fetchUserWorkoutHistory} workoutHistory={workoutHistory} />;
            case 'home':
            default:
                return <HomePage isAdmin={isAdmin} />;
        }
    };

    return (
        <div className="min-h-screen text-gray-200">
            <Header
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onLoginClick={() => setIsLoginModalOpen(true)}
                onHistoryClick={() => setIsHistoryModalOpen(true)}
            />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {renderPage()}
            </main>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <WorkoutHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                history={workoutHistory}
            />

            <footer className="text-center py-8 text-gray-500 border-t border-gray-800 mt-16">
                <p>Powered by Firebase</p>
            </footer>
        </div>
    );
};

export default App;
