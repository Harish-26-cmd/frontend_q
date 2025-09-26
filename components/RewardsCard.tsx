import React from 'react';
import type { User } from '../types';

interface RewardsCardProps {
    user: User;
}

const RewardsCard: React.FC<RewardsCardProps> = ({ user }) => {
    return (
        <div className="bg-gradient-to-br from-primary/80 to-primary dark:from-slate-800 dark:to-black rounded-xl shadow-2xl p-6 text-primary-foreground relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-2xl font-bold">Hi, {user.name}</h2>
                <div className="mt-4 flex items-baseline gap-4">
                     <p className="text-4xl font-black text-primary-foreground/90 dark:text-blue-300">{user.points.toLocaleString()}</p>
                     <p className="text-lg font-semibold text-primary-foreground/80 dark:text-slate-300">Q-Points</p>
                </div>
                <p className="text-sm text-primary-foreground/70 dark:text-slate-400 mt-2">Earn points every time you queue!</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-foreground/10 rounded-full"></div>
            <div className="absolute -bottom-16 -left-5 w-40 h-40 bg-primary-foreground/10 rounded-full"></div>
        </div>
    );
}

export default RewardsCard;