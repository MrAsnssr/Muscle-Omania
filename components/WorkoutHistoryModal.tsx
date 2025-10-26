import React from 'react';
import Modal from './Modal';
import type { WorkoutSession } from '../types';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: WorkoutSession[];
}

const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({ isOpen, onClose, history }) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    // FIX: Corrected typo from toLocaleDate'string' to toLocaleDateString
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} - ${formattedTime}`;
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workout History">
        {history.length === 0 ? (
             <p className="text-gray-400 text-center py-10">Your workout history is empty. Go lift some weights!</p>
        ) : (
            <div className="space-y-6">
                {history.map(session => (
                    <div key={session.id} className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <div className="flex justify-between items-baseline mb-3 border-b border-white/10 pb-3">
                            <h3 className="font-bold text-lg text-white">{session.equipmentName}</h3>
                            <p className="text-xs text-gray-400 font-semibold">
                                {formatDate(session.createdAt)}
                            </p>
                        </div>
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
    </Modal>
  );
};

export default WorkoutHistoryModal;
