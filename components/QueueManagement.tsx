
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Staff, Queue, Location, Person } from '../types';
import { getStaffByLocation } from '../services/staffService';
import { getQueues, getLocationById } from '../services/queueService';
import { UsersIcon, ClockIcon, ArrowLeftIcon } from './icons';
import { Skeleton } from './skeletons/Skeleton';

interface StaffWithQueue extends Staff {
    assignedQueue: Queue | null;
}

const StaffQueueCard: React.FC<{ staffMember: StaffWithQueue }> = ({ staffMember }) => {
    return (
        <div className="bg-card rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
                <img 
                    src={staffMember.photoUrl}
                    alt={staffMember.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-border-color"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/150?u=${encodeURIComponent(staffMember.name)}` }}
                />
                <div>
                    <h3 className="text-lg font-bold text-card-foreground">{staffMember.name}</h3>
                    <p className="text-text-secondary text-sm">{staffMember.role} - {staffMember.specialty}</p>
                </div>
            </div>
            
            <div className="bg-background dark:bg-foreground/50 rounded-lg p-4">
                {staffMember.assignedQueue ? (
                    <div>
                        <p className="text-sm font-semibold text-text-secondary">Managing Queue:</p>
                        <h4 className="text-md font-bold text-primary mb-2">{staffMember.assignedQueue.name}</h4>
                        <div className="flex justify-between text-sm text-text-secondary">
                            <div className="flex items-center gap-1.5">
                                <UsersIcon className="w-4 h-4" />
                                <span>{staffMember.assignedQueue.people.length} waiting</span>
                            </div>
                             <div className="flex items-center gap-1.5">
                                <ClockIcon className="w-4 h-4" />
                                <span>~{staffMember.assignedQueue.averageServiceTimeMinutes} min/person</span>
                            </div>
                        </div>
                         <div className="mt-3 pt-3 border-t border-border-color">
                             <p className="text-sm font-medium text-text-secondary">Currently Serving:</p>
                             <p className="text-md font-bold text-text-primary truncate">
                                {staffMember.assignedQueue.currentlyServing ? staffMember.assignedQueue.currentlyServing.name : 'Nobody'}
                            </p>
                         </div>
                    </div>
                ) : (
                     <div className="text-center py-4">
                        <p className="font-semibold text-text-secondary">Unassigned</p>
                        <p className="text-sm text-text-secondary/80">This staff member is not currently managing a queue.</p>
                     </div>
                )}
            </div>
        </div>
    );
};

const StaffQueueCardSkeleton: React.FC = () => (
     <div className="bg-card rounded-xl shadow-md p-5">
        <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
    </div>
);


interface QueueManagementProps {
  locationId: string;
  onBack: () => void;
}

const QueueManagement: React.FC<QueueManagementProps> = ({ locationId, onBack }) => {
    const [staffWithQueues, setStaffWithQueues] = useState<StaffWithQueue[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndCombineData = async () => {
            setIsLoading(true);
            try {
                const [staffData, queuesData, locationData] = await Promise.all([
                    getStaffByLocation(locationId),
                    getQueues({ locationId }),
                    getLocationById(locationId),
                ]);

                const combinedData = staffData.map(staff => {
                    const assignedQueue = queuesData.find(q => q.managedByStaffId === staff.id) || null;
                    return { ...staff, assignedQueue };
                });

                setStaffWithQueues(combinedData);
                setLocation(locationData || null);

            } catch (error) {
                console.error("Failed to fetch queue management data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndCombineData();
    }, [locationId]);

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Departments
            </button>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Queue Management</h1>
                 <p className="text-lg text-text-secondary">
                    Assign and monitor queues for staff at {location ? `"${location.name}"` : '...'}
                </p>
            </header>
            
            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <StaffQueueCardSkeleton key={i} />)}
                </div>
            ) : staffWithQueues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffWithQueues.map(member => (
                        <StaffQueueCard key={member.id} staffMember={member} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center justify-center">
                    <UsersIcon className="h-12 w-12 text-text-secondary/50 mb-4" />
                    <p className="text-lg font-semibold text-card-foreground">No Staff Found</p>
                    <p className="text-text-secondary">No staff members are assigned to this department to manage queues.</p>
                </div>
            )}
        </div>
    );
};

export default QueueManagement;