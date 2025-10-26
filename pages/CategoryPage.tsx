
import React, { useState, useEffect } from 'react';
import { getEquipmentListByCategory, deleteEquipment, addEquipment, updateEquipmentInDb, getCategories, getCategoryById } from '../services/firebaseService';
import type { Equipment, Category } from '../types';
import EquipmentCard from '../components/EquipmentCard';
import SkeletonCard from '../components/SkeletonCard';
import AddEquipmentModal from '../components/AddEquipmentModal';
import EditEquipmentModal from '../components/EditEquipmentModal';

interface CategoryPageProps {
  categoryId: string;
  isAdmin: boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, isAdmin }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const categoryName = category?.name || 'Category';

  const fetchData = async () => {
      setIsLoading(true);
      setIsGridVisible(false);
      setError(null);
      try {
        const [categoryData, equipment, allCategoriesData] = await Promise.all([
          getCategoryById(categoryId),
          getEquipmentListByCategory(categoryId),
          getCategories() // Still needed for the edit/add modals
        ]);

        if (!categoryData) {
            throw new Error("Category not found.");
        }
        
        setCategory(categoryData);
        setEquipmentList(equipment);
        setAllCategories(allCategoriesData);
      } catch (err) {
        setError('Failed to load category details. Please try again.');
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsGridVisible(true), 100);
      }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const handleAddEquipment = async (newEquipmentData: Omit<Equipment, 'id'>) => {
    try {
        await addEquipment(newEquipmentData);
        fetchData(); // Refetch to show the new equipment
        setIsAddModalOpen(false);
    } catch (error) {
        console.error("Error adding equipment:", error);
        setError("Failed to add new machine. Please try again.");
    }
  };
  
  const handleUpdateEquipment = async (updatedEquipment: Equipment) => {
    try {
        await updateEquipmentInDb(updatedEquipment.id, updatedEquipment);
        fetchData(); // Refetch to show changes
        setEditingEquipment(null);
    } catch (err) {
        console.error("Error updating equipment:", err);
        setError("Failed to update machine. Please try again.");
    }
  };

  const handleDeleteEquipment = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        try {
            await deleteEquipment(id);
            fetchData(); // Refetch to ensure UI is in sync
        } catch (error) {
            console.error("Error deleting equipment:", error);
            setError("Failed to delete machine. Please try again.");
        }
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => window.location.hash = '#home'} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Categories
        </button>
        <h2 className="text-3xl font-extrabold tracking-tight uppercase text-white">
          {isLoading || !category ? 'Loading...' : category.name}
        </h2>
        <div></div>
      </div>

      {isAdmin && (
        <div className="text-center mb-12">
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading || !!error}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider text-sm disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
          >
            + Add Machine to {categoryName}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg border border-red-700">
          <p className="font-bold text-xl">An Error Occurred</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-2xl font-bold text-gray-400">This category is empty.</p>
            <p className="text-gray-500 mt-2">{isAdmin ? 'Click the button above to add the first machine!' : 'Check back later for new equipment.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {equipmentList.map((equipment, index) => (
            <div
              key={equipment.id}
              className={`transition-all duration-500 ease-out ${isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <EquipmentCard 
                equipment={equipment}
                isAdmin={isAdmin}
                onEdit={() => setEditingEquipment(equipment)}
                onDelete={() => handleDeleteEquipment(equipment.id, equipment.name)}
              />
            </div>
          ))}
        </div>
      )}
      
      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEquipment}
        categories={allCategories}
        initialCategoryId={categoryId}
      />
      
      {editingEquipment && (
        <EditEquipmentModal
            isOpen={!!editingEquipment}
            onClose={() => setEditingEquipment(null)}
            equipment={editingEquipment}
            onSave={handleUpdateEquipment}
            categories={allCategories}
        />
      )}
    </>
  );
};

export default CategoryPage;