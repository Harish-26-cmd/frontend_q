
import React, { useState, useEffect } from 'react';
import type { Queue, User } from '../types';
import { predictWaitTime } from '../services/predictionService';
import { ClockIcon } from './icons';
import { Skeleton } from './skeletons/Skeleton';
import clsx from 'clsx';

interface QueueCardProps {
  queue: Queue;
  onViewQueue: (queueId: string) => void;
  user: User;
  onJoinQueue: (queueId: string, queueName: string) => Promise<void>;
}

const QueueCard: React.FC<QueueCardProps> = ({ queue, onViewQueue, user, onJoinQueue }) => {
  const [predictedWait, setPredictedWait] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getPrediction = async () => {
        if (!isMounted) return;
        setIsPredicting(true);
        const time = await predictWaitTime(queue);
        if (isMounted) {
            setPredictedWait(time);
            setIsPredicting(false);
        }
    };
    getPrediction();
    return () => { isMounted = false; };
  }, [queue]);

  const { buttonText, buttonAction, isButtonDisabled } = React.useMemo(() => {
    if (user.role === 'admin') {
      return {
        buttonText: 'Manage Queue',
        buttonAction: () => onViewQueue(queue.id),
        isButtonDisabled: false,
      };
    }
    
    // Customer logic
    const isInThisQueue = user.currentQueueId === queue.id;
    const isInAnotherQueue = user.currentQueueId && user.currentQueueId !== queue.id;

    if (isInAnotherQueue) {
      return { buttonText: 'In Another Queue', buttonAction: () => {}, isButtonDisabled: true };
    }
    if (isInThisQueue) {
      return { buttonText: 'View My Spot', buttonAction: () => onViewQueue(queue.id), isButtonDisabled: false };
    }
    return { buttonText: 'Join Queue', buttonAction: () => onJoinQueue(queue.id, queue.name), isButtonDisabled: false };
    
  }, [user, queue, onViewQueue, onJoinQueue]);
  
  return (
    <div
      className="bg-card rounded-xl shadow-md dark:shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:scale-[1.03] text-left w-full h-full flex flex-col group"
    >
      <div className="w-full h-40 overflow-hidden">
        <img 
            src={queue.imageUrl} 
            alt={queue.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-card-foreground truncate">{queue.name}</h3>
        <p className="text-sm text-text-secondary mt-1">{queue.people.length} people waiting</p>
        
        <div className="mt-2 h-5">
            {isPredicting ? (
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                </div>
            ) : (
                <div className="flex items-center gap-1.5 text-text-secondary">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-semibold text-sm">~ {predictedWait} min wait</span>
                </div>
            )}
        </div>

      </div>
       <div className="p-4 pt-0">
          <button
            onClick={buttonAction}
            disabled={isButtonDisabled}
            className={clsx(
              'w-full font-semibold py-2 px-4 flex justify-center items-center rounded-lg transition-colors duration-300 text-sm',
              {
                'bg-background/80 dark:bg-foreground/80 text-text-secondary cursor-not-allowed': isButtonDisabled,
                'bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground': !isButtonDisabled,
              }
            )}
          >
            {buttonText}
          </button>
       </div>
    </div>
  );
};

export default React.memo(QueueCard);