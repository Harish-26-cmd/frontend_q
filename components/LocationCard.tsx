import React from 'react';
import type { Location, User } from '../types';
import { LocationPinIcon, ClockIcon } from './icons';

interface LocationCardProps {
  location: Location;
  onSelect: (locationId: string) => void;
  userRole: User['role'];
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onSelect, userRole }) => {
  const buttonText = userRole === 'admin' ? 'More Details' : 'View Services';

  return (
    <button
      onClick={() => onSelect(location.id)}
      className="bg-card rounded-xl shadow-md dark:shadow-lg text-left w-full h-full flex flex-col p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:scale-[1.03] group"
    >
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-card-foreground truncate mb-2">{location.name}</h3>
        
        <div className="space-y-3 text-text-secondary">
            <div className="flex items-start gap-3">
                <LocationPinIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{location.address}</span>
            </div>
            <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 flex-shrink-0" />
                <span>
                    {location.openingTime}
                    {location.closingTime && ` - ${location.closingTime}`}
                </span>
            </div>
        </div>
      </div>
      
      <div className="pt-6 mt-auto">
          <span
            className="w-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground font-semibold py-2.5 px-4 flex justify-center items-center rounded-lg transition-colors duration-300"
          >
            {buttonText}
          </span>
       </div>
    </button>
  );
};

export default React.memo(LocationCard);