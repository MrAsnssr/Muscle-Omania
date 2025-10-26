

import React, { useState, useEffect } from 'react';
import type firebase from 'firebase/compat/app';
import type { Equipment, WorkoutSession } from '../types';
import { getEquipmentById } from '../services/firebaseService';
import WorkoutLogger from '../components/WorkoutLogger';
import Spinner from '../components/Spinner';

interface EquipmentPageProps {
  equipmentId: string;
  user: firebase.User | null;
  onSessionSaved: () => void;
  workoutHistory: WorkoutSession[];
}

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    let videoId = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (e) { return null; }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

const EquipmentPage: React.FC<EquipmentPageProps> = ({ equipmentId, user, onSessionSaved, workoutHistory }) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMachineHistory, setShowMachineHistory] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEquipmentById(equipmentId);
        if (!data) {
          throw new Error("Equipment not found.");
        }
        setEquipment(data);
      } catch (err) {
        setError("Could not load equipment details. It may have been deleted.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
  }, [equipmentId]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }
  
  if (error || !equipment) {
    return (
      <div className="text-center py-16">
          <p className="text-2xl font-bold text-red-400">Error Loading Equipment</p>
          <p className="text-gray-500 mt-2">{error}</p>
          <button onClick={() => window.location.hash = '#home'} className="mt-6 inline-block text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors">
            Back to Home
          </button>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(equipment.videoUrl);
  const machineHistory = workoutHistory.filter(session => session.equipmentId === equipment.id);
  const lastSession = machineHistory.length > 0 ? machineHistory[0] : null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="text-2xl font-bold tracking-tight text-white mb-4">{children}</h4>
  );

  return (
    <div>
        <div className="mb-8 flex items-center">
            <button onClick={() => window.location.hash = `#category/${equipment.categoryId}`} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {equipment.categoryName}
            </button>
        </div>

        <h2 className="text-4xl font-extrabold tracking-tight uppercase text-white mb-4">{equipment.name}</h2>
        <button onClick={() => window.location.hash = `#category/${equipment.categoryId}`} className="inline-block bg-red-800 text-red-100 text-xs font-bold mb-8 px-3 py-1 rounded-full uppercase tracking-wider">{equipment.categoryName}</button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-8">
                <img src={equipment.imageUrl} alt={equipment.name} className="w-full h-auto max-h-[500px] object-cover rounded-lg border border-white/10" />
                
                {embedUrl && (
                    <div>
                        <SectionTitle>Technique Video</SectionTitle>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe 
                                src={embedUrl}
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full rounded-lg border border-white/10 aspect-video"
                            ></iframe>
                        </div>
                    </div>
                )}

                {equipment.info && (
                    <div>
                        <SectionTitle>Extra Info</SectionTitle>
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{equipment.info}</p>
                    </div>
                )}
            </div>

            <div className="lg:col-span-2 space-y-8">
                 {user && (
                    <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                {showMachineHistory ? 'Machine History' : 'Last Session'}
                            </h3>
                            {machineHistory.length > 0 && (
                                <button 
                                    onClick={() => setShowMachineHistory(!showMachineHistory)} 
                                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-full transition-colors"
                                >
                                    {showMachineHistory ? 'Show Last' : `View All (${machineHistory.length})`}
                                </button>
                            )}
                        </div>
                        
                        {machineHistory.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">You haven't logged a workout on this machine yet.</p>
                        ) : !showMachineHistory && lastSession ? (
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-2">{formatDate(lastSession.createdAt)}</p>
                            <ul className="space-y-2 text-gray-300">
                            {lastSession.sets.map((set, index) => (
                                <li key={index} className="flex justify-between p-2 rounded-md bg-gray-800/50 text-sm">
                                    <span className="font-semibold">Set {index + 1}{set.side ? ` (${set.side})` : ''}:</span>
                                    <span>{set.weight !== undefined && set.reps !== undefined ? `${set.weight} kg x ${set.reps} reps` : `${set.duration} min - ${set.distance} km`}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                        ) : (
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                {machineHistory.map(session => (
                                    <div key={session.id} className="border-t border-white/10 pt-3 first:border-t-0">
                                        <p className="text-gray-400 text-sm font-bold mb-2">{formatDate(session.createdAt)}</p>
                                        <ul className="space-y-2 text-gray-300">
                                        {session.sets.map((set, index) => (
                                            <li key={index} className="flex justify-between p-2 rounded-md bg-gray-800/50 text-sm">
                                                <span className="font-semibold">Set {index + 1}{set.side ? ` (${set.side})` : ''}:</span>
                                                <span>{set.weight !== undefined && set.reps !== undefined ? `${set.weight} kg x ${set.reps} reps` : `${set.duration} min - ${set.distance} km`}</span>
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <WorkoutLogger equipment={equipment} userId={user?.uid} onSessionSaved={onSessionSaved} />
            </div>
        </div>
    </div>
  );
};

export default EquipmentPage;