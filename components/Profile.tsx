
import React from 'react';
import type { User } from '../types';
import { UserIcon } from './icons';

interface ProfileProps {
    user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    return (
        <div className="bg-card rounded-xl shadow-md p-8 text-center flex flex-col items-center justify-center h-96">
            <div className="p-4 bg-background dark:bg-foreground rounded-full mb-4">
                <UserIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">Profile Management</h3>
            <p className="text-text-secondary mt-2 max-w-sm">
                More profile settings and customization options are coming soon! For now, you can view your details and log out using the profile icon in the header.
            </p>
        </div>
    );
};

export default Profile;