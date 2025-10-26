import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Equipment } from '../types';
import { generateEquipmentInfo } from '../services/geminiService';
import ImageGenerator from './ImageGenerator';

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onSave: (equipment: Equipment) => void;
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ isOpen, onClose, equipment, onSave }) => {
  const [name, setName] = useState(equipment.name);
  const [imageUrl, setImageUrl] = useState(equipment.imageUrl);
  const [info, setInfo] = useState(equipment.info || '');
  const [videoUrl, setVideoUrl] = useState(equipment.videoUrl || '');
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  const [characterDescription, setCharacterDescription] = useState('');

  useEffect(() => {
    setName(equipment.name);
    setImageUrl(equipment.imageUrl);
    setInfo(equipment.info || '');
    setVideoUrl(equipment.videoUrl || '');
    setCharacterDescription(''); // Reset on new equipment
  }, [equipment]);

  const handleSave = () => {
    onSave({ ...equipment, name, imageUrl, info, videoUrl });
  };
  
  const handleGenerateInfo = async () => {
    setIsGeneratingInfo(true);
    const generatedInfo = await generateEquipmentInfo(name);
    setInfo(generatedInfo);
    setIsGeneratingInfo(false);
  };
  
  const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${equipment.name}`}>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Machine Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />
        </div>
        
        <div>
            <label className={labelClasses}>Image Generation</label>
            <div className="bg-gray-800/50 p-4 rounded-md border border-white/10 space-y-4">
                <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-md border border-white/10"/>
                
                <div>
                    <label htmlFor="character" className={labelClasses}>Character Template (Describe your character)</label>
                    <textarea
                        id="character"
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
                <label htmlFor="info" className={labelClasses}>Additional Information</label>
                <button 
                    onClick={handleGenerateInfo}
                    disabled={isGeneratingInfo}
                    className="flex items-center gap-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full transition-colors disabled:bg-gray-600 disabled:cursor-wait"
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
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className={inputClasses}
            rows={8}
            placeholder="Add any extra details, setup tips, or variations here, or generate them with AI."
          />
        </div>

        <div>
          <label htmlFor="videoUrl" className={labelClasses}>Technique Video URL (Optional)</label>
          <input
            id="videoUrl"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputClasses}
            placeholder="e.g., https://www.youtube.com/watch?v=..."
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditEquipmentModal;