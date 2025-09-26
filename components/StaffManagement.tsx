
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Staff, Location } from '../types';
import { getStaffByLocation, addStaff } from '../services/staffService';
import { getLocationById } from '../services/queueService';
import { PlusIcon, UserIcon, ArrowLeftIcon } from './icons';
import { Skeleton } from './skeletons/Skeleton';
import Modal from './Modal';
import AddStaffForm from './AddStaffForm';

// Internal component for displaying a single staff member
const StaffCard: React.FC<{ staff: Staff }> = ({ staff }) => {
    const statusClasses = useMemo(() => {
        switch (staff.status) {
            case 'Active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'On Call':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Offline':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }, [staff.status]);

    return (
        <div className="bg-card rounded-xl shadow-md p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:scale-105">
            <img 
                src={staff.photoUrl}
                alt={staff.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-border-color mb-4"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/150?u=${encodeURIComponent(staff.name)}` }}
            />
            <h3 className="text-lg font-bold text-card-foreground">{staff.name}</h3>
            <p className="text-primary font-semibold text-sm">{staff.specialty}</p>
            <p className="text-text-secondary/80 text-sm mb-4">{staff.role}</p>
             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
                {staff.status}
            </span>
        </div>
    );
};

// Internal component for loading skeleton
const StaffCardSkeleton: React.FC = () => (
    <div className="bg-card rounded-xl shadow-md p-5 flex flex-col items-center">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/3 rounded-full" />
    </div>
);


interface StaffManagementProps {
  locationId: string;
  onBack: () => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ locationId, onBack }) => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchStaffData = useCallback(async () => {
        try {
            const staffData = await getStaffByLocation(locationId);
            setStaff(staffData);
        } catch (error) {
            console.error("Failed to fetch staff data:", error);
        }
    }, [locationId]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [staffData, locationData] = await Promise.all([
                    getStaffByLocation(locationId),
                    getLocationById(locationId)
                ]);
                setStaff(staffData);
                setLocation(locationData || null);
            } catch (error) {
                console.error("Failed to fetch initial staff or location data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [locationId]);
    
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleAddStaff = async (newStaffData: Omit<Staff, 'id' | 'locationId'>) => {
        if (!locationId) return;
        setIsSubmitting(true);
        try {
            await addStaff({ ...newStaffData, locationId });
            handleCloseAddModal();
            await fetchStaffData(); // Re-fetch to show the new staff member
        } catch (error) {
            console.error("Failed to add staff", error);
            alert("There was an error adding the staff member. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                    <h1 className="text-3xl font-bold text-text-primary">Staff Management</h1>
                    <p className="text-lg text-text-secondary">
                        Viewing staff for {location ? `"${location.name}"` : '...'}
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Staff
                </button>
            </header>
            
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <StaffCardSkeleton key={i} />)}
                </div>
            ) : staff.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {staff.map(member => (
                        <StaffCard key={member.id} staff={member} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center justify-center">
                    <UserIcon className="h-12 w-12 text-text-secondary/50 mb-4" />
                    <p className="text-lg font-semibold text-card-foreground">No Staff Found</p>
                    <p className="text-text-secondary">There are no staff members assigned to this department.</p>
                </div>
            )}

            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} title="Add New Staff Member">
                <AddStaffForm 
                    onSubmit={handleAddStaff}
                    onCancel={handleCloseAddModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </div>
    );
};

export default StaffManagement;