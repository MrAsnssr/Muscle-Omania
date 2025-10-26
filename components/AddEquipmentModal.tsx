import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Equipment } from '../types';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, 'id'>) => void;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('https://source.unsplash.com/600x400/?gym-equipment-placeholder');
  const [info, setInfo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
        // Reset form when modal opens
        setName('');
        setImageUrl('https://source.unsplash.com/600x400/?gym-equipment-placeholder');
        setInfo('');
        setVideoUrl('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
        alert("Machine name is required.");
        return;
    }
    onSave({ name, imageUrl, info, videoUrl });
  };
  
  const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Machine">
      <div className="space-y-6">
        <div>
          <label htmlFor="add-name" className={labelClasses}>Machine Name</label>
          <input
            id="add-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            placeholder="e.g., Cable Crossover Machine"
          />
        </div>
        
        <div>
            <label htmlFor="add-imageUrl" className={labelClasses}>Image URL</label>
             <input
                id="add-imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={inputClasses}
                placeholder="https://source.unsplash.com/..."
            />
            <img src={imageUrl} alt={name || "New Machine"} className="w-full h-48 object-cover rounded-md border border-white/10 mt-4"/>
        </div>

        <div>
            <label htmlFor="add-info" className={labelClasses}>Additional Information</label>
          <textarea
            id="add-info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className={inputClasses}
            rows={8}
            placeholder="Add any extra details, setup tips, or variations here."
          />
        </div>

        <div>
          <label htmlFor="add-videoUrl" className={labelClasses}>Technique Video URL (Optional)</label>
          <input
            id="add-videoUrl"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputClasses}
            placeholder="e.g., https://www.youtube.com/watch?v=..."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
        >
          Add Machine
        </button>
      </div>
    </Modal>
  );
};

export default AddEquipmentModal;