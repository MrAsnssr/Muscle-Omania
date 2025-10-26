
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Category } from '../types';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSave: (category: Category) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, category, onSave }) => {
  const [name, setName] = useState(category.name);
  const [imageUrl, setImageUrl] = useState(category.imageUrl);

  useEffect(() => {
    setName(category.name);
    setImageUrl(category.imageUrl);
  }, [category]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }
    onSave({ ...category, name, imageUrl });
  };

  const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${category.name}`}>
      <div className="space-y-6">
        <div>
          <label htmlFor="edit-cat-name" className={labelClasses}>Category Name</label>
          <input
            id="edit-cat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="edit-cat-imageUrl" className={labelClasses}>Image URL</label>
          <input
            id="edit-cat-imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClasses}
          />
          {imageUrl && <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-md border border-white/10 mt-4"/>}
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;
