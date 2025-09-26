import React, { useState, useEffect, useCallback } from 'react';
import type { Queue, Location } from '../types';
import { getQueues, addQueue, updateQueue, deleteQueue } from '../services/queueService';
import { getLocationById } from '../services/queueService';
import { PlusIcon, ArrowLeftIcon, ServiceManagementIcon, ClockIcon, UsersIcon, PencilIcon, TrashIcon } from './icons';
import { Skeleton } from './skeletons/Skeleton';
import Modal from './Modal';
import ServiceForm from './ServiceForm';

const ServiceCard: React.FC<{ queue: Queue, onEdit: () => void, onDelete: () => void }> = ({ queue, onEdit, onDelete }) => (
    <div className="bg-card rounded-xl shadow-md overflow-hidden transition-all duration-300 flex flex-col group">
        <img 
            src={queue.imageUrl} 
            alt={queue.name}
            loading="lazy"
            className="w-full h-40 object-cover"
        />
        <div className="p-4 flex-grow">
            <h3 className="text-lg font-bold text-card-foreground truncate">{queue.name}</h3>
            <div className="mt-2 flex items-center justify-between text-sm text-text-secondary">
                <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    <span>{queue.averageServiceTimeMinutes} min avg</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <UsersIcon className="h-4 w-4" />
                    <span>{queue.people.length} waiting</span>
                </div>
            </div>
        </div>
        <div className="p-4 pt-0 border-t border-border-color/50 flex gap-2">
            <button
                onClick={onEdit}
                className="w-full font-semibold py-2 px-4 flex justify-center items-center rounded-lg transition-colors duration-300 text-sm bg-background dark:bg-foreground hover:bg-border-color/50 text-text-secondary hover:text-text-primary"
            >
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
            </button>
            <button
                onClick={onDelete}
                className="w-full font-semibold py-2 px-4 flex justify-center items-center rounded-lg transition-colors duration-300 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400"
            >
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
            </button>
        </div>
    </div>
);

const ServiceCardSkeleton: React.FC = () => (
    <div className="bg-card rounded-xl shadow-md p-4 flex flex-col gap-4">
        <Skeleton className="w-full h-40" />
        <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full mt-auto" />
    </div>
);


interface ServiceManagementProps {
  locationId: string;
  onBack: () => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ locationId, onBack }) => {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingQueue, setEditingQueue] = useState<Queue | null>(null);

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        try {
            const [queuesData, locationData] = await Promise.all([
                getQueues({ locationId }),
                getLocationById(locationId)
            ]);
            setQueues(queuesData);
            setLocation(locationData || null);
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setIsLoading(false);
        }
    }, [locationId]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleOpenCreateModal = () => {
        setEditingQueue(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (queue: Queue) => {
        setEditingQueue(queue);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingQueue(null);
    };

    const handleSubmit = async (formData: { name: string, averageServiceTimeMinutes: number, imageUrl: string }) => {
        setIsSubmitting(true);
        try {
            if (editingQueue) {
                await updateQueue(editingQueue.id, { ...formData });
            } else {
                await addQueue({ ...formData, locationId });
            }
            await fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to submit service:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (queueId: string) => {
        if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            try {
                await deleteQueue(queueId);
                await fetchServices();
            } catch (error) {
                console.error("Failed to delete service:", error);
                alert("An error occurred while deleting the service.");
            }
        }
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Departments
            </button>

            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Service Management</h1>
                    <p className="text-lg text-text-secondary">
                        Manage services for {location ? `"${location.name}"` : '...'}
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    <PlusIcon className="h-5 w-5" />
                    Create Service
                </button>
            </header>
            
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
                </div>
            ) : queues.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queues.map(queue => (
                        <ServiceCard 
                          key={queue.id} 
                          queue={queue} 
                          onEdit={() => handleOpenEditModal(queue)}
                          onDelete={() => handleDelete(queue.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center justify-center">
                    <ServiceManagementIcon className="h-12 w-12 text-text-secondary/50 mb-4" />
                    <p className="text-lg font-semibold text-card-foreground">No Services Found</p>
                    <p className="text-text-secondary">Create a new service to get started.</p>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingQueue ? "Edit Service" : "Create New Service"}>
                <ServiceForm
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    initialData={editingQueue}
                />
            </Modal>
        </div>
    );
};

export default ServiceManagement;