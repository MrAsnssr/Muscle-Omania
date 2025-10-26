
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Category } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('https://source.unsplash.com/600x400/?workout-category');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setImageUrl('https://source.unsplash.com/600x400/?workout-category');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }
    onSave({ name, imageUrl });
  };

  const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <div className="space-y-6">
        <div>
          <label htmlFor="add-cat-name" className={labelClasses}>Category Name</label>
          <input
            id="add-cat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            placeholder="e.g., Core"
          />
        </div>
        <div>
          <label htmlFor="add-cat-imageUrl" className={labelClasses}>Image URL</label>
          <input
            id="add-cat-imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClasses}
            placeholder="https://source.unsplash.com/..."
          />
          {imageUrl && <img src={imageUrl} alt={name || "New Category"} className="w-full h-48 object-cover rounded-md border border-white/10 mt-4"/>}
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
        >
          Add Category
        </button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
