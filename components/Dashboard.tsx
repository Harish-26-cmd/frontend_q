
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getQueues } from '../services/queueService';
import { getStaffByLocation } from '../services/staffService';
import type { Queue, User, Person, Staff } from '../types';
import QueueCard from './QueueCard';
import RewardsCard from './RewardsCard';
import History from './History';
import Profile from './Profile';
import { CardSkeleton } from './skeletons/CardSkeleton';
import { UsersIcon, MenuIcon, ChevronRightIcon, ArrowLeftIcon, ClockIcon, BriefcaseIcon } from './icons';

interface DashboardProps {
  user: User;
  onViewQueue: (queueId: string) => void;
  locationId: string | null; // Null for admin to fetch all, string for customer
  onBack?: () => void;
  onJoinQueue: (queueId: string, queueName: string) => Promise<void>;
}

type CustomerDashboardTab = 'services' | 'history' | 'profile';

// Card for top stats in Admin Dashboard
const StatCard: React.FC<{icon: React.ReactNode, title: string, value: string | number, subtext?: string}> = ({ icon, title, value, subtext }) => (
    <div className="bg-card rounded-xl shadow-sm p-5 flex items-center gap-4">
        <div className="bg-primary/10 rounded-lg p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary font-medium">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-card-foreground">{value}</p>
                {subtext && <p className="text-sm font-medium text-text-secondary">{subtext}</p>}
            </div>
        </div>
    </div>
);


const AdminDashboard: React.FC<{ queues: Queue[], staff: Staff[], onViewQueue: (queueId: string) => void, isLoading: boolean, user: User, onBack?: () => void }> = ({ queues, staff, onViewQueue, isLoading, user, onBack }) => {
    
    const { totalPatients, averageWaitTime, activeDoctors } = useMemo(() => {
        const totalPatients = queues.reduce((sum, queue) => sum + queue.people.length, 0);
        
        const totalWait = queues.reduce((sum, queue) => sum + queue.people.length * queue.averageServiceTimeMinutes, 0);
        const averageWaitTime = totalPatients > 0 ? Math.round(totalWait / totalPatients) : 0;
        
        const activeDoctors = staff.filter(s => s.role.toLowerCase() === 'doctor' && s.status === 'Active').length;

        return { totalPatients, averageWaitTime, activeDoctors };
    }, [queues, staff]);

    const allPatients = queues.flatMap(queue => 
        queue.people.map((person, index) => ({
            ...person,
            queueName: queue.name,
            token: `${queue.name.substring(0,3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
            waitTime: Math.round((Date.now() - new Date(person.joinedAt).getTime()) / 60000)
        }))
    ).sort((a,b) => b.waitTime - a.waitTime);
    
    return (
        <div>
            {onBack && (
                 <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Departments
                </button>
            )}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Home Dashboard</h1>
                <button className="bg-card rounded-md p-2 shadow-sm lg:hidden">
                    <MenuIcon className="w-6 h-6 text-text-secondary"/>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard icon={<UsersIcon className="w-6 h-6 text-primary"/>} title="Patients in Queue" value={totalPatients} />
                <StatCard icon={<ClockIcon className="w-6 h-6 text-primary"/>} title="Average Wait Time" value={averageWaitTime} subtext="min" />
                <StatCard icon={<BriefcaseIcon className="w-6 h-6 text-primary"/>} title="Doctors Active" value={activeDoctors} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-xl shadow-sm p-6">
                     <h2 className="text-xl font-bold text-card-foreground mb-4">Live Queue Overview</h2>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-secondary uppercase">
                                <tr>
                                    <th className="px-4 py-2">Token Number</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Wait Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPatients.slice(0, 6).map(p => (
                                    <tr key={p.id} className="border-b border-border-color">
                                        <td className="px-4 py-3 font-medium text-text-secondary">{p.token}</td>
                                        <td className="px-4 py-3 text-card-foreground">{p.name}</td>
                                        <td className="px-4 py-3 text-text-secondary">{p.waitTime} min</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {allPatients.length === 0 && !isLoading && (
                            <p className="text-center py-8 text-text-secondary">No patients currently in queue.</p>
                        )}
                        {isLoading && <p className="text-center py-8 text-text-secondary">Loading queues...</p>}
                     </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-card rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-card-foreground mb-4">Quick Links</h2>
                        <ul className="text-text-secondary space-y-1">
                            <li className="flex justify-between items-center p-2 rounded-md hover:bg-background dark:hover:bg-foreground cursor-pointer"><span>Manage Staff</span> <ChevronRightIcon className="w-5 h-5"/></li>
                            <li className="flex justify-between items-center p-2 rounded-md hover:bg-background dark:hover:bg-foreground cursor-pointer"><span>Manage Services</span> <ChevronRightIcon className="w-5 h-5"/></li>
                        </ul>
                    </div>
                     <div className="bg-card rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-card-foreground mb-4">AI Wait Time Prediction</h2>
                        <div className="w-full h-32 text-primary">
                           <svg className="w-full h-full" viewBox="0 0 100 50">
                             <path d="M 0 40 C 10 10, 20 10, 30 30 S 40 50, 50 40 S 60 10, 70 20 S 80 45, 90 40 S 100 20, 100 20" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round"/>
                           </svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

const QueueStatusBanner: React.FC<{ queueName: string, onViewQueue: () => void }> = ({ queueName, onViewQueue }) => (
    <div className="bg-primary/10 border border-primary/20 text-primary dark:text-blue-300 rounded-xl shadow-md p-4 flex items-center justify-between gap-4 mb-8">
        <div>
            <p className="font-semibold">You are currently in a queue!</p>
            <p className="text-sm">You're waiting for: <span className="font-bold">{queueName}</span></p>
        </div>
        <button onClick={onViewQueue} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm whitespace-nowrap">
            View My Spot
        </button>
    </div>
);

interface CustomerDashboardProps {
  queues: Queue[];
  onViewQueue: (queueId: string) => void;
  user: User;
  isLoading: boolean;
  onJoinQueue: (queueId: string, queueName: string) => Promise<void>;
  onBack?: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ queues, onViewQueue, user, isLoading, onJoinQueue, onBack }) => {
    const [activeTab, setActiveTab] = useState<CustomerDashboardTab>('services');

    const renderTabContent = () => {
        if (isLoading && activeTab === 'services') {
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
            )
        }
        
        switch (activeTab) {
            case 'services':
                return queues.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {queues.map((queue) => (
                            <QueueCard key={queue.id} queue={queue} onViewQueue={onViewQueue} user={user} onJoinQueue={onJoinQueue} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center justify-center">
                        <UsersIcon className="h-12 w-12 text-text-secondary/50 mb-4" />
                        <p className="text-lg font-semibold text-card-foreground">No Services Available</p>
                        <p className="text-text-secondary">No active queues found for this location.</p>
                        <p className="mt-2 text-sm text-text-secondary/80">Please select another location to see its services.</p>
                    </div>
                );
            case 'history':
                return <History />;
            case 'profile':
                return <Profile user={user} />;
            default:
                return null;
        }
    }

    const TabButton: React.FC<{ tab: CustomerDashboardTab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-md transition-colors duration-300 ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:bg-background dark:hover:bg-foreground'}`}
        >
            {label}
        </button>
    );

    return (
        <div>
            {onBack && (
                 <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Locations
                </button>
            )}
            <div className="space-y-8">
                {user.currentQueueId && user.currentQueueName && (
                    <QueueStatusBanner queueName={user.currentQueueName} onViewQueue={() => onViewQueue(user.currentQueueId!)} />
                )}
                <RewardsCard user={user} />
                <div className="bg-card rounded-xl shadow-md p-2 flex items-center gap-2">
                    <TabButton tab="services" label="Available Services" />
                    <TabButton tab="history" label="My History" />
                    <TabButton tab="profile" label="My Profile" />
                </div>
                <div>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}


const Dashboard: React.FC<DashboardProps> = ({ user, onViewQueue, locationId, onBack, onJoinQueue }) => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const fetchDashboardData = useCallback(async (showLoader: boolean) => {
    if (!locationId) {
        setIsLoading(false);
        setQueues([]);
        setStaff([]);
        return;
    }
    if (showLoader) setIsLoading(true);

    try {
        const fetchPromises: [Promise<Queue[]>, Promise<Staff[]>?] = [getQueues({ locationId })];
        if (user.role === 'admin') {
            fetchPromises.push(getStaffByLocation(locationId));
        }

        const [queuesData, staffData] = await Promise.all(fetchPromises);
        
        setQueues(queuesData);
        if (staffData) {
            setStaff(staffData);
        }

    } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setQueues([]);
        setStaff([]);
    } finally {
        if (showLoader) setIsLoading(false);
    }
  }, [locationId, user.role]);


  useEffect(() => {
    // Only fetch if we have the necessary info (for customers, a locationId is required)
    if (user.role === 'admin' || (user.role === 'customer' && locationId)) {
        fetchDashboardData(true); // Initial fetch with loader
        
        const intervalId = setInterval(() => {
            // Only refresh if the page is visible to save resources
            if (document.visibilityState === 'visible') {
                fetchDashboardData(false); // Subsequent fetches without loader
            }
        }, 15000); // Refresh every 15 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    } else if (user.role === 'customer' && !locationId) {
        // Handle case where customer dashboard is rendered without a location
        setIsLoading(false);
        setQueues([]);
    }
  }, [locationId, user.role, fetchDashboardData]);

  if (user.role === 'admin') {
      return <AdminDashboard queues={queues} staff={staff} onViewQueue={onViewQueue} isLoading={isLoading} user={user} onBack={onBack} />;
  }

  if (user.role === 'customer') {
      return <CustomerDashboard queues={queues} onViewQueue={onViewQueue} user={user} isLoading={isLoading} onJoinQueue={onJoinQueue} onBack={onBack} />;
  }
  
  return null; // Should not happen
};

export default Dashboard;