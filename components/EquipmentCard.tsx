import React from 'react';
import type { Equipment } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect: (equipment: Equipment) => void;
  isAdmin: boolean;
  onEdit: (equipment: Equipment) => void;
  onDelete: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onSelect, isAdmin, onEdit, onDelete }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(equipment);
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }

  return (
    <div 
      className="bg-gray-900/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer group focus-within:ring-4 focus-within:ring-red-500/50 outline-none border border-gray-800 hover:border-transparent relative p-1"
      onClick={() => onSelect(equipment)}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect(equipment)}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
        <div className="bg-gray-900 rounded-lg h-full flex flex-col">
            <div className="overflow-hidden rounded-t-lg">
                <img className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105" src={equipment.imageUrl} alt={equipment.name} />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-bold text-center text-white transition-colors duration-300 group-hover:text-white">{equipment.name}</h3>
                {isAdmin && (
                <div className="mt-3 w-full flex gap-2">
                    <button 
                        onClick={handleEditClick}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md transition-colors text-xs"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={handleDeleteClick}
                        className="flex-shrink-0 bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md transition-colors text-xs"
                    >
                        Delete
                    </button>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default EquipmentCard;