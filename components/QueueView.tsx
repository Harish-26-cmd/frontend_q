import React, { useState, useEffect, useCallback } from 'react';
import type { Queue, Person, User } from '../types';
import { getQueueById, callNextPerson, removePersonFromQueue, addPersonToQueue, removeSpecificPersonFromQueue } from '../services/queueService';
import PersonCard from './PersonCard';
import { ArrowLeftIcon, PlusIcon, UsersIcon } from './icons';
import { Skeleton } from './skeletons/Skeleton';
import clsx from 'clsx';

interface QueueViewProps {
  queueId: string;
  onBack: () => void;
  user: User;
  onJoinQueue: (queueId: string, queueName: string) => Promise<void>;
  onLeaveQueue: (queueId: string) => Promise<void>;
}

const QueueView: React.FC<QueueViewProps> = ({ queueId, onBack, user, onJoinQueue, onLeaveQueue }) => {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [newPersonName, setNewPersonName] = useState('');

  const fetchQueue = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    const data = await getQueueById(queueId);
    setQueue(data || null);
    if (showLoader) setIsLoading(false);
  }, [queueId]);

  useEffect(() => {
    fetchQueue(true); // Initial fetch

    const intervalId = setInterval(() => {
      // Only refresh if the page is visible
      if (document.visibilityState === 'visible') {
        fetchQueue(false); // Refresh without loader
      }
    }, 5000); // Refresh every 5 seconds for a more "live" feel

    return () => clearInterval(intervalId);
  }, [fetchQueue]); 

  const handleCallNext = async () => {
    setIsUpdating(true);
    await callNextPerson(queueId);
    await fetchQueue(false);
    setIsUpdating(false);
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.role !== 'admin') return;
    const trimmedName = newPersonName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 30) return;

    setIsUpdating(true);
    // Admins add people without joining themselves
    await addPersonToQueue(queueId, trimmedName);
    setNewPersonName('');
    await fetchQueue(false);
    setIsUpdating(false);
  };

  const handleRemovePerson = async (personId: string) => {
    if (user.role !== 'admin') return;
    setIsUpdating(true);
    await removeSpecificPersonFromQueue(queueId, personId);
    await fetchQueue(false);
    setIsUpdating(false);
  };

  const handleJoinQueueClick = async () => {
    if (!queue) return;
    setIsUpdating(true);
    await onJoinQueue(queue.id, queue.name);
    await fetchQueue(false);
    setIsUpdating(false);
  };

  const handleLeaveQueueClick = async () => {
    if (!queue) return;
    setIsUpdating(true);
    await onLeaveQueue(queue.id);
    await fetchQueue(false);
    setIsUpdating(false);
  }
  
  const isAddPersonDisabled = isUpdating || newPersonName.trim().length < 2 || newPersonName.trim().length > 30;

  if (isLoading) {
    return (
       <div className="space-y-8">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                </div>
            </div>
       </div>
    );
  }

  if (!queue) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 dark:text-red-400">Queue not found.</p>
        <button onClick={onBack} className="mt-4 text-primary hover:text-primary/80">
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const isCallNextDisabled = queue.people.length === 0 || isUpdating;
  const isAdmin = user.role === 'admin';
  
  const isUserInThisQueue = user.currentQueueId === queue.id;
  const canUserJoinQueue = user.currentQueueId === null;
  const userPosition = isUserInThisQueue ? queue.people.findIndex(p => p.userId === user.id) + 1 : 0;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
        <ArrowLeftIcon className="h-5 w-5" />
        Back
      </button>

      <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold mb-2 text-card-foreground">{queue.name}</h2>
        <p className="text-text-secondary">Average service time: {queue.averageServiceTimeMinutes} minutes</p>
         {isUserInThisQueue && userPosition > 0 && (
             <p className="mt-3 text-lg font-bold text-primary bg-primary/10 p-3 rounded-md">
                You are #{userPosition} in the queue.
            </p>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-text-primary">Waiting List ({queue.people.length})</h3>
          {queue.people.length > 0 ? (
            <div className="space-y-3">
              {queue.people.map((person, index) => (
                <PersonCard 
                  key={person.id} 
                  person={person} 
                  index={index} 
                  isUser={person.userId === user.id}
                  onRemove={isAdmin ? handleRemovePerson : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-background dark:bg-card/50 rounded-lg text-center p-4">
                <UsersIcon className="h-12 w-12 text-text-secondary/50 mb-3" />
                <p className="font-semibold text-text-secondary">The waiting list is empty.</p>
                <p className="text-sm text-text-secondary/80">{isAdmin ? "Add a person using the form to get started." : "Be the first to join!"}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-text-primary">
                {isAdmin ? "Admin Controls" : "Queue Status"}
              </h3>
              <div className="bg-card rounded-lg p-4 shadow-md">
                 {isAdmin ? (
                    <button 
                      onClick={handleCallNext} 
                      disabled={isCallNextDisabled}
                      className={clsx(`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center`, {
                          'bg-foreground dark:bg-slate-600 text-text-secondary dark:text-slate-400 cursor-not-allowed': isCallNextDisabled,
                          'bg-primary hover:bg-primary/90 text-primary-foreground': !isCallNextDisabled
                      })}
                      >
                      {isUpdating && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>}
                      Call Next Person
                    </button>
                 ) : (
                    <>
                      {isUserInThisQueue ? (
                        <button onClick={handleLeaveQueueClick} disabled={isUpdating} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-red-400 flex items-center justify-center">
                           {isUpdating && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>}
                           Leave Queue
                        </button>
                      ) : (
                        <button onClick={handleJoinQueueClick} disabled={isUpdating || !canUserJoinQueue} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center">
                          {isUpdating && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>}
                          {canUserJoinQueue ? 'Join Queue' : 'In Another Queue'}
                        </button>
                      )}
                    </>
                 )}
                <div className="mt-4">
                    <h4 className="font-semibold text-lg mb-2 text-card-foreground">Currently Serving</h4>
                    <div className="bg-background dark:bg-foreground/50 rounded-lg p-4 text-center border-l-4 border-yellow-400 dark:border-yellow-500">
                        {queue.currentlyServing ? (
                            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{queue.currentlyServing.name}</p>
                        ) : (
                            <p className="text-text-secondary italic">No one is being served.</p>
                        )}
                    </div>
                </div>
              </div>
            </div>

           {isAdmin && (
              <div>
                  <h3 className="text-2xl font-semibold mb-4 text-text-primary">Add Person</h3>
                  <form onSubmit={handleAddPerson} className="bg-card rounded-lg p-4 shadow-md">
                        <input
                            type="text"
                            value={newPersonName}
                            onChange={(e) => setNewPersonName(e.target.value)}
                            placeholder="New person's name"
                            minLength={2}
                            maxLength={30}
                            className="w-full bg-background dark:bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="submit" disabled={isAddPersonDisabled} className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                          <PlusIcon className="h-5 w-5 mr-2" /> Add to Queue
                        </button>
                  </form>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default QueueView;