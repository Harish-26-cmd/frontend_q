
import React from 'react';
import { ClockIcon } from './icons';

const History: React.FC = () => {
    return (
        <div className="bg-card rounded-xl shadow-md p-8 text-center flex flex-col items-center justify-center h-96">
            <div className="p-4 bg-background dark:bg-foreground rounded-full mb-4">
                <ClockIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">View Your History</h3>
            <p className="text-text-secondary mt-2 max-w-sm">
                This feature is coming soon! You'll be able to see a full record of your past queues and service times right here.
            </p>
        </div>
    );
};

export default History;