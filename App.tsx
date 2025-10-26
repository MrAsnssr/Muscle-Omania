
import React, { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import Header from './components/Header';
import EquipmentCard from './components/EquipmentCard';
import Modal from './components/Modal';
import EquipmentDetail from './components/EquipmentDetail';
import LoginModal from './components/LoginModal';
import EditEquipmentModal from './components/EditEquipmentModal';
import WorkoutHistoryModal from './components/WorkoutHistoryModal';
import SkeletonCard from './components/SkeletonCard';
import AddEquipmentModal from './components/AddEquipmentModal';
import type { Equipment, WorkoutSession } from './types';
import { firebaseConfig } from './firebaseConfig';
import { 
    onAuthStateChangedListener, 
    logoutUser, 
    getEquipmentList,
    updateEquipmentInDb,
    addEquipment,
    deleteEquipment,
    seedDatabase,
    getUserProfile,
    getWorkoutHistory,
} from './services/firebaseService';

const App: React.FC = () => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isGridVisible, setIsGridVisible] = useState(false);

    const fetchUserWorkoutHistory = useCallback(async () => {
        if (user) {
            const history = await getWorkoutHistory(user.uid);
            setWorkoutHistory(history);
        }
    }, [user]);

    useEffect(() => {
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

    useEffect(() => {
        const fetchEquipment = async () => {
            setIsLoading(true);
            setIsGridVisible(false);
            setError(null);
            try {
                // Check if the config keys are still placeholders before making a request.
                if (firebaseConfig.apiKey.startsWith("[YOUR_")) {
                    throw new Error("Configuration Error: Please replace the placeholder values in 'firebaseConfig.ts' with your actual Firebase keys.");
                }

                const list = await getEquipmentList();
                if (list.length === 0) {
                    await seedDatabase();
                    const seededList = await getEquipmentList();
                    setEquipmentList(seededList);
                } else {
                    setEquipmentList(list);
                }
            } catch (err) {
                console.error("Firebase fetch error:", err);
                if (err instanceof Error && err.message.startsWith("Configuration Error:")) {
                    setError(err.message);
                } else {
                    setError("Could not connect to the database. Common issues: 1) If deployed, add your site's domain (e.g., username.github.io) to Firebase Authentication's 'Authorized domains'. 2) Check your Firestore security rules to allow reads on the 'equipment' collection.");
                }
            } finally {
                setIsLoading(false);
                setTimeout(() => setIsGridVisible(true), 100);
            }
        };
        fetchEquipment();
    }, []);


    const handleSelectEquipment = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
    };

    const handleCloseDetailModal = () => {
        setSelectedEquipment(null);
    };

    const handleLogout = async () => {
        await logoutUser();
    };

    const handleOpenEditModal = (equipment: Equipment) => {
        setEditingEquipment(equipment);
    };

    const handleCloseEditModal = () => {
        setEditingEquipment(null);
    };

    const handleUpdateEquipment = async (updatedEquipment: Equipment) => {
        try {
            const { id, ...dataToUpdate } = updatedEquipment;
            await updateEquipmentInDb(id, dataToUpdate);
            setEquipmentList(prevList => 
                prevList.map(item => 
                    item.id === updatedEquipment.id ? updatedEquipment : item
                ).sort((a, b) => a.name.localeCompare(b.name))
            );
            if (selectedEquipment && selectedEquipment.id === updatedEquipment.id) {
                setSelectedEquipment(updatedEquipment);
            }
            handleCloseEditModal();
        } catch (err) {
            console.error("Error updating equipment:", err);
            setError("Failed to update machine. Please try again.");
        }
    };

    const handleAddEquipment = async (newEquipmentData: Omit<Equipment, 'id'>) => {
        try {
            const newDocRef = await addEquipment(newEquipmentData);
            const newEquipment: Equipment = { id: newDocRef.id, ...newEquipmentData };
            setEquipmentList(prevList => [...prevList, newEquipment].sort((a, b) => a.name.localeCompare(b.name)));
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error adding equipment:", error);
            setError("Failed to add new machine. Please try again.");
        }
    };
    
    const handleDeleteEquipment = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                await deleteEquipment(id);
                setEquipmentList(prevList => prevList.filter(item => item.id !== id));
            } catch (error) {
                console.error("Error deleting equipment:", error);
                setError("Failed to delete machine. Please try again.");
            }
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
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase">
                        <span className="gradient-text">MUSCLE OMANIA</span>
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Choose your equipment to see techniques, track your progress, and conquer your goals.
                    </p>
                </div>
                
                {isAdmin && (
                    <div className="text-center mb-12">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider text-sm"
                        >
                            + Add New Machine
                        </button>
                    </div>
                )}
                
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>
                ) : error ? (
                     <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg border border-red-700">
                        <p className="font-bold text-xl">An Error Occurred</p>
                        <p className="mt-2">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {equipmentList.map((equipment, index) => (
                            <div
                                key={equipment.id}
                                className={`transition-all duration-500 ease-out ${isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <EquipmentCard 
                                    equipment={equipment}
                                    onSelect={handleSelectEquipment}
                                    isAdmin={isAdmin}
                                    onEdit={handleOpenEditModal}
                                    onDelete={() => handleDeleteEquipment(equipment.id, equipment.name)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Modal
                isOpen={!!selectedEquipment}
                onClose={handleCloseDetailModal}
                title={selectedEquipment?.name || ''}
            >
                {selectedEquipment && <EquipmentDetail equipment={selectedEquipment} userId={user?.uid} onSessionSaved={fetchUserWorkoutHistory} workoutHistory={workoutHistory} />}
            </Modal>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <AddEquipmentModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddEquipment}
            />

            {editingEquipment && (
                <EditEquipmentModal
                    isOpen={!!editingEquipment}
                    onClose={handleCloseEditModal}
                    equipment={editingEquipment}
                    onSave={handleUpdateEquipment}
                />
            )}
            
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