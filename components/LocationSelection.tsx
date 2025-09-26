import React, { useState, useEffect } from 'react';
import type { Location, ServiceCategory } from '../types';
import { getLocationsByCategory } from '../services/queueService';
import LocationCard from './LocationCard';
import { ArrowLeftIcon } from './icons';
import { CardSkeleton } from './skeletons/CardSkeleton';

interface LocationSelectionProps {
  category: ServiceCategory;
  onSelectLocation: (locationId: string) => void;
  onBack: () => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({ category, onSelectLocation, onBack }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      const data = await getLocationsByCategory(category);
      setLocations(data);
      setIsLoading(false);
    };

    fetchLocations();
  }, [category]);

  const categoryTitle = {
    hospital: 'Healthcare',
  }[category];

  return (
    <div>
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Service Categories
        </button>
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
                Choose a {categoryTitle} Location
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-text-secondary">
                Select a location below to see its available services and queue times.
            </p>
        </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} withImage={false} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.length > 0 ? (
            locations.map((location) => (
              <LocationCard key={location.id} location={location} onSelect={onSelectLocation} userRole="customer" />
            ))
          ) : (
            <p className="col-span-full text-center text-text-secondary py-16">
              No locations found for this service category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelection;