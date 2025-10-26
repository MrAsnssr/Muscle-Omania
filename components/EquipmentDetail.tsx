import React, { useState } from 'react';
import type { Equipment, WorkoutSession } from '../types';
import WorkoutLogger from './WorkoutLogger';

interface EquipmentDetailProps {
  equipment: Equipment;
  userId?: string;
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
    } catch (e) {
        return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment, userId, onSessionSaved, workoutHistory }) => {
  const [showMachineHistory, setShowMachineHistory] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(equipment.videoUrl);

  const machineHistory = workoutHistory.filter(
    session => session.equipmentId === equipment.id
  );
  const lastSession = machineHistory.length > 0 ? machineHistory[0] : null;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    // FIX: Corrected typo from toLocaleDate'string' to toLocaleDateString
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="text-xl font-bold tracking-tight text-white mb-3">{children}</h4>
  );

  return (
    <div className="space-y-8">
      <img src={equipment.imageUrl} alt={equipment.name} className="w-full h-64 object-cover rounded-lg border border-white/10" />
      
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
                    className="w-full h-full rounded-lg border border-white/10"
                ></iframe>
            </div>
        </div>
      )}

      {equipment.info && (
        <div>
            <SectionTitle>Extra Info</SectionTitle>
            <p className="text-gray-300 whitespace-pre-wrap">{equipment.info}</p>
        </div>
      )}
      
      {userId && (
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
            
            {machineHistory.length === 0 && (
              <p className="text-gray-400 text-center py-4">You haven't logged a workout on this machine yet.</p>
            )}

            {machineHistory.length > 0 && !showMachineHistory && lastSession && (
              <div>
                <p className="text-gray-400 text-sm font-bold mb-2">{formatDate(lastSession.createdAt)}</p>
                <ul className="space-y-2 text-gray-300">
                  {lastSession.sets.map((set, index) => (
                    <li key={index} className="flex justify-between p-2 rounded-md bg-gray-800/50 text-sm">
                      <span className="font-semibold">Set {index + 1}{set.side ? ` (${set.side})` : ''}:</span>
                      <span>{set.weight} kg x {set.reps} reps</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {machineHistory.length > 0 && showMachineHistory && (
                 <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {machineHistory.map(session => (
                        <div key={session.id} className="border-t border-white/10 pt-3 first:border-t-0">
                            <p className="text-gray-400 text-sm font-bold mb-2">{formatDate(session.createdAt)}</p>
                            <ul className="space-y-2 text-gray-300">
                            {session.sets.map((set, index) => (
                                <li key={index} className="flex justify-between p-2 rounded-md bg-gray-800/50 text-sm">
                                    <span className="font-semibold">Set {index + 1}{set.side ? ` (${set.side})` : ''}:</span>
                                    <span>{set.weight} kg x {set.reps} reps</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      <WorkoutLogger 
        equipment={equipment} 
        userId={userId} 
        onSessionSaved={onSessionSaved} 
      />
    </div>
  );
};

export default EquipmentDetail;