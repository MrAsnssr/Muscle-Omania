

import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/firebaseService';
import CategoryCard from '../components/CategoryCard';
import SkeletonCard from '../components/SkeletonCard';
import AddCategoryModal from '../components/AddCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';

interface HomePageProps {
  isAdmin: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isAdmin }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setIsGridVisible(false);
    setError(null);
    try {
      const categoryList = await getCategories();
      setCategories(categoryList);
    } catch (err) {
      setError('Failed to load workout categories. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsGridVisible(true), 100);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategoryData: Omit<Category, 'id'>) => {
    try {
        await addCategory(newCategoryData);
        fetchCategories(); // Refetch to get the new category with its ID
        setIsAddModalOpen(false);
    } catch (error) {
        console.error("Error adding category:", error);
        setError("Failed to add category. Please try again.");
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
        await updateCategory(updatedCategory.id, { name: updatedCategory.name, imageUrl: updatedCategory.imageUrl });
        fetchCategories(); // Refetch to ensure UI is in sync
        setEditingCategory(null);
    } catch (error) {
        console.error("Error updating category:", error);
        setError("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" category? This will not delete the equipment inside it.`)) {
        try {
            await deleteCategory(id);
            fetchCategories(); // Refetch to ensure UI is in sync
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category. Please try again.");
        }
    }
  };

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase">
          <span className="gradient-text">MUSCLE OMANIA</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Choose a category to begin your workout.
        </p>
      </div>

      {isAdmin && (
        <div className="text-center mb-12">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider text-sm"
          >
            + Add New Category
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg border border-red-700">
          <p className="font-bold text-xl">An Error Occurred</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`transition-all duration-500 ease-out ${isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <CategoryCard 
                category={category}
                isAdmin={isAdmin}
                onEdit={() => setEditingCategory(category)}
                onDelete={() => handleDeleteCategory(category.id, category.name)}
              />
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
      />
      
      {editingCategory && (
        <EditCategoryModal 
            isOpen={!!editingCategory}
            onClose={() => setEditingCategory(null)}
            category={editingCategory}
            onSave={handleUpdateCategory}
        />
      )}
    </>
  );
};

export default HomePage;
