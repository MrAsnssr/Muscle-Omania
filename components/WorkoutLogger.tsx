import React, { useState } from 'react';
import type { WorkoutSet, Equipment, SetData } from '../types';
import { saveWorkoutSession } from '../services/firebaseService';

interface WorkoutLoggerProps {
    equipment: Equipment;
    userId?: string;
    onSessionSaved: () => void;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ equipment, userId, onSessionSaved }) => {
    const [sets, setSets] = useState<WorkoutSet[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    
    // State for strength workouts
    const [isSplit, setIsSplit] = useState(false);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [leftWeight, setLeftWeight] = useState('');
    const [leftReps, setLeftReps] = useState('');
    const [rightWeight, setRightWeight] = useState('');
    const [rightReps, setRightReps] = useState('');

    // State for cardio workouts
    const [duration, setDuration] = useState('');
    const [distance, setDistance] = useState('');

    const isStrength = equipment.type === 'strength';

    const handleAddSet = () => {
        if (isStrength) {
            if (isSplit) {
                const newSets: WorkoutSet[] = [];
                if (leftWeight && leftReps) {
                    newSets.push({ id: Date.now() + Math.random(), weight: leftWeight, reps: leftReps, side: 'Left' });
                }
                if (rightWeight && rightReps) {
                    newSets.push({ id: Date.now() + Math.random(), weight: rightWeight, reps: rightReps, side: 'Right' });
                }
                if (newSets.length > 0) {
                    setSets(prev => [...prev, ...newSets]);
                }
                setLeftWeight('');
                setLeftReps('');
                setRightWeight('');
                setRightReps('');
            } else {
                if (weight && reps) {
                    setSets(prev => [...prev, { id: Date.now(), weight, reps }]);
                    setWeight('');
                    setReps('');
                }
            }
        } else { // Cardio
            if (duration && distance) {
                setSets(prev => [...prev, { id: Date.now(), duration, distance }]);
                setDuration('');
                setDistance('');
            }
        }
    };

    const handleRemoveSet = (id: number) => {
        setSets(sets.filter(set => set.id !== id));
    };

    const handleSaveSession = async () => {
        if (!userId || sets.length === 0) return;

        setIsSaving(true);
        setSaveMessage('');
        
        const setsToSave: SetData[] = sets.map(({ id, ...rest }) => rest);

        const sessionData = {
            userId,
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            createdAt: new Date().toISOString(),
            sets: setsToSave,
        };

        try {
            await saveWorkoutSession(sessionData);
            setSaveMessage('Session saved successfully!');
            setSets([]);
            onSessionSaved();
        } catch (error) {
            console.error("Error saving session:", error);
            setSaveMessage('Failed to save session. Please try again.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";

    return (
        <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold tracking-tight text-white mb-4">Workout Logger</h3>
            
            {isStrength && (
                 <div className="flex items-center mb-4">
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" checked={isSplit} onChange={() => setIsSplit(!isSplit)} className="sr-only" />
                            <div className={`block w-14 h-8 rounded-full border-2 transition-colors ${isSplit ? 'bg-gradient-to-r from-red-500 to-orange-500 border-transparent' : 'bg-gray-700 border-gray-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isSplit ? 'translate-x-full' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-white font-semibold">Unilateral (Left/Right)</div>
                    </label>
                </div>
            )}
            
            <div className="grid gap-4 mb-4 grid-cols-2">
                {isStrength ? (
                    isSplit ? (
                        <>
                            <div className="col-span-2 font-bold text-gray-300">Left Side</div>
                            <input type="number" placeholder="Weight (kg)" value={leftWeight} onChange={e => setLeftWeight(e.target.value)} className={inputClasses} />
                            <input type="number" placeholder="Reps" value={leftReps} onChange={e => setLeftReps(e.target.value)} className={inputClasses} />

                            <div className="col-span-2 font-bold text-gray-300 mt-2">Right Side</div>
                            <input type="number" placeholder="Weight (kg)" value={rightWeight} onChange={e => setRightWeight(e.target.value)} className={inputClasses} />
                            <input type="number" placeholder="Reps" value={rightReps} onChange={e => setRightReps(e.target.value)} className={inputClasses} />
                        </>
                    ) : (
                        <>
                            <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} className={inputClasses} />
                            <input type="number" placeholder="Reps" value={reps} onChange={e => setReps(e.target.value)} className={inputClasses} />
                        </>
                    )
                ) : (
                    <>
                        <input type="number" placeholder="Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} className={inputClasses} />
                        <input type="number" placeholder="Distance (km)" value={distance} onChange={e => setDistance(e.target.value)} className={inputClasses} />
                    </>
                )}
            </div>
            <button 
                onClick={handleAddSet} 
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider"
            >
                Add Set
            </button>

            <div className="mt-6">
                <h4 className="font-bold text-lg mb-2 text-gray-300">Logged Sets ({sets.length})</h4>
                {sets.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Log your first set to get started!</p>
                ) : (
                    <ul className="space-y-2">
                        {sets.map((set, index) => (
                            <li key={set.id} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center">
                                <span className="font-semibold">
                                    Set {index + 1}: {set.side ? `${set.side} - ` : ''}
                                    {set.weight !== undefined && set.reps !== undefined
                                        ? `${set.weight} kg x ${set.reps} reps`
                                        : `${set.duration} min - ${set.distance} km`
                                    }
                                </span>
                                <button onClick={() => handleRemoveSet(set.id)} className="text-gray-500 hover:text-white text-xs font-bold uppercase">X</button>
                            </li>
                        ))}
                    </ul>
                )}
                {sets.length > 0 && (
                     <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleSaveSession} 
                            disabled={!userId || isSaving}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full transition-colors uppercase tracking-wider disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Session'}
                        </button>
                        <button 
                            onClick={() => setSets([])} 
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-colors uppercase tracking-wider"
                        >
                            Clear All
                        </button>
                     </div>
                )}
                 {saveMessage && (
                    <p className={`text-center mt-3 font-bold transition-opacity duration-300 ${saveMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                        {saveMessage}
                    </p>
                )}
                {!userId && sets.length > 0 && (
                    <p className="text-center text-yellow-400 mt-3 text-sm font-semibold bg-yellow-900/50 py-2 px-3 rounded-md">
                        Please log in to save your workout session.
                    </p>
                )}
            </div>
        </div>
    );
};

export default WorkoutLogger;