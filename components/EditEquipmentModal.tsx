import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Equipment, Category } from '../types';

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onSave: (equipment: Equipment) => void;
  categories: Category[];
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ isOpen, onClose, equipment, onSave, categories }) => {
  const [name, setName] = useState(equipment.name);
  const [imageUrl, setImageUrl] = useState(equipment.imageUrl);
  const [info, setInfo] = useState(equipment.info || '');
  const [videoUrl, setVideoUrl] = useState(equipment.videoUrl || '');
  const [type, setType] = useState<'strength' | 'cardio'>(equipment.type || 'strength');
  const [categoryId, setCategoryId] = useState(equipment.categoryId);

  useEffect(() => {
    setName(equipment.name);
    setImageUrl(equipment.imageUrl);
    setInfo(equipment.info || '');
    setVideoUrl(equipment.videoUrl || '');
    setType(equipment.type || 'strength');
    setCategoryId(equipment.categoryId);
  }, [equipment]);

  const handleSave = () => {
    const categoryName = categories.find(c => c.id === categoryId)?.name || equipment.categoryName;
    onSave({ ...equipment, name, imageUrl, info, videoUrl, type, categoryId, categoryName });
  };
  
  const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${equipment.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-name" className={labelClasses}>Machine Name</label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
            </div>
             <div>
                <label htmlFor="edit-type" className={labelClasses}>Equipment Type</label>
                <select
                    id="edit-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'strength' | 'cardio')}
                    className={inputClasses}
                >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                </select>
            </div>
        </div>

        <div>
            <label htmlFor="edit-category" className={labelClasses}>Category</label>
            <select
                id="edit-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClasses}
            >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
        </div>
        
        <div>
            <label htmlFor="imageUrl" className={labelClasses}>Image URL</label>
             <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={inputClasses}
            />
            <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-md border border-white/10 mt-4"/>
        </div>

        <div>
            <label htmlFor="info" className={labelClasses}>Additional Information</label>
          <textarea
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className={inputClasses}
            rows={8}
            placeholder="Add any extra details, setup tips, or variations here."
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
