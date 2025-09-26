import React, { useState, useEffect } from 'react';
import type { Location, ServiceCategory } from '../types';
import { getLocationsByCategory, addLocation } from '../services/queueService';
import LocationCard from './LocationCard';
import { ArrowLeftIcon, PlusIcon } from './icons';
import { CardSkeleton } from './skeletons/CardSkeleton';
import Modal from './Modal';
import CreateDepartmentForm from './CreateDepartmentForm';

interface DepartmentSelectionProps {
  category: ServiceCategory;
  onSelectLocation: (locationId: string) => void;
  onBack: () => void;
}

const DepartmentSelection: React.FC<DepartmentSelectionProps> = ({ category, onSelectLocation, onBack }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAndSetLocations = async () => {
      setIsLoading(true);
      const data = await getLocationsByCategory(category);
      setLocations(data);
      setIsLoading(false);
  };

  useEffect(() => {
    fetchAndSetLocations();
  }, [category]);

  const categoryTitle = {
    hospital: 'Healthcare',
  }[category];

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateDepartment = async (newDepartmentData: Omit<Location, 'id' | 'category'>) => {
    setIsSubmitting(true);
    try {
        await addLocation({ ...newDepartmentData, category });
        handleCloseCreateModal();
        await fetchAndSetLocations(); // Re-fetch to show the new department
    } catch (error) {
        console.error("Failed to create department", error);
        alert("There was an error creating the department. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div>
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Service Categories
        </button>
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
                Manage Departments
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-text-secondary">
                Select an existing department to view its details or create a new one.
            </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} withImage={false} />)
        ) : (
          <>
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} onSelect={onSelectLocation} userRole="admin" />
            ))}
            <button
              onClick={handleOpenCreateModal}
              className="bg-foreground/50 dark:bg-card/50 border-2 border-dashed border-border-color/50 rounded-xl text-left w-full h-full flex flex-col justify-center items-center p-6 transition-all duration-300 hover:border-primary hover:bg-primary/10 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-text-secondary/70 group-hover:text-primary transition-colors">
                  <PlusIcon className="h-12 w-12"/>
              </div>
              <h3 className="mt-4 text-xl font-bold text-text-secondary group-hover:text-primary transition-colors">Create New Department</h3>
            </button>
          </>
        )}
         {locations.length === 0 && !isLoading && (
            <p className="col-span-full text-center text-text-secondary py-16">
              No existing departments found for this service category.
            </p>
          )}
      </div>

       <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} title="Create New Department">
          <CreateDepartmentForm
              onSubmit={handleCreateDepartment}
              onCancel={handleCloseCreateModal}
              isSubmitting={isSubmitting}
          />
      </Modal>
    </div>
  );
};

export default DepartmentSelection;