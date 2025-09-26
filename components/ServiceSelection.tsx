
import React from 'react';
import type { ServiceCategory, User } from '../types';
import { HospitalIcon, PlusIcon } from './icons';

interface ServiceSelectionProps {
  onSelectService: (category: ServiceCategory) => void;
  userName: string;
  userRole?: User['role'];
}

const ServiceCard: React.FC<{
  label: string;
  category: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
  icon: React.ReactNode;
}> = ({ label, category, onSelect, icon }) => (
  <button
    onClick={() => onSelect(category)}
    className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-primary/5 dark:hover:bg-primary/10 group w-full max-w-xs"
  >
    <div className="text-primary mb-4 transition-transform group-hover:scale-110">
        {icon}
    </div>
    <h3 className="text-2xl font-bold text-card-foreground">{label}</h3>
  </button>
);

const MemoizedServiceCard = React.memo(ServiceCard);

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelectService, userName, userRole }) => {
  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
        Hello, {userName}!
      </h1>
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary mb-12">
        Please select a service category to find the right queue for you.
      </p>

      <div className="flex justify-center items-stretch flex-wrap gap-8 max-w-5xl mx-auto">
        <MemoizedServiceCard
          label="Healthcare"
          category="hospital"
          onSelect={onSelectService}
          icon={<HospitalIcon className="h-16 w-16" />}
        />
        {userRole && (
            <div
                className="bg-foreground/50 dark:bg-card/50 border-2 border-dashed border-border-color/50 rounded-xl p-8 flex flex-col items-center justify-center text-center w-full max-w-xs"
            >
                <div className="text-text-secondary/50 mb-4">
                    <PlusIcon className="h-16 w-16" />
                </div>
                <h3 className="text-2xl font-bold text-text-secondary/70">Coming Soon</h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;