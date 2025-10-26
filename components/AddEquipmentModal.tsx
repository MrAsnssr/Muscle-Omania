import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Equipment } from '../types';
import { generateEquipmentInfo } from '../services/geminiService';
import ImageGenerator from './ImageGenerator';

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
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  const [characterDescription, setCharacterDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
        // Reset form when modal opens
        setName('');
        setImageUrl('https://source.unsplash.com/600x400/?gym-equipment-placeholder');
        setInfo('');
        setVideoUrl('');
        setCharacterDescription('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
        alert("Machine name is required.");
        return;
    }
    onSave({ name, imageUrl, info, videoUrl });
  };
  
  const handleGenerateInfo = async () => {
    if (!name.trim()) {
        alert("Please enter a machine name first.");
        return;
    }
    setIsGeneratingInfo(true);
    const generatedInfo = await generateEquipmentInfo(name);
    setInfo(generatedInfo);
    setIsGeneratingInfo(false);
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
            <label className={labelClasses}>Image Generation</label>
            <div className="bg-gray-800/50 p-4 rounded-md border border-white/10 space-y-4">
                <img src={imageUrl} alt={name || "New Machine"} className="w-full h-48 object-cover rounded-md border border-white/10"/>
                
                <div>
                    <label htmlFor="add-character" className={labelClasses}>Character Template (Describe your character)</label>
                    <textarea
                        id="add-character"
                        value={characterDescription}
                        onChange={(e) => setCharacterDescription(e.target.value)}
                        className={inputClasses}
                        rows={2}
                        placeholder="e.g., a cartoon muscular bull, a futuristic robot, etc."
                    />
                </div>

                <ImageGenerator 
                    equipmentName={name} 
                    characterDescription={characterDescription}
                    onImageGenerated={setImageUrl} 
                />
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="add-info" className={labelClasses}>Additional Information</label>
                <button 
                    onClick={handleGenerateInfo}
                    disabled={isGeneratingInfo || !name}
                    className="flex items-center gap-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isGeneratingInfo ? (
                        <>
                           <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                           <span>Generating...</span>
                        </>
                    ) : (
                        "✨ Generate with AI"
                    )}
                </button>
            </div>
          <textarea
            id="add-info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className={inputClasses}
            rows={8}
            placeholder="Add any extra details, setup tips, or variations here, or generate them with AI."
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