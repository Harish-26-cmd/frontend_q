import React, { useState, useEffect } from 'react';
import type { Queue } from '../types';
import { PlusIcon, PencilIcon } from './icons';

interface ServiceFormProps {
    onSubmit: (data: { name: string, averageServiceTimeMinutes: number, imageUrl: string }) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    initialData?: Queue | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onSubmit, onCancel, isSubmitting, initialData }) => {
    const [name, setName] = useState('');
    const [averageServiceTimeMinutes, setAverageServiceTimeMinutes] = useState(15);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setAverageServiceTimeMinutes(initialData.averageServiceTimeMinutes);
            setImageUrl(initialData.imageUrl);
        } else {
            setName('');
            setAverageServiceTimeMinutes(15);
            setImageUrl('');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || averageServiceTimeMinutes <= 0) {
            alert('Please fill out all required fields with valid values.');
            return;
        }

        onSubmit({
            name,
            averageServiceTimeMinutes,
            imageUrl: imageUrl.trim() || `https://source.unsplash.com/random/400x300/?service,work&sig=${Date.now()}`,
        });
    };
    
    const isSubmitDisabled = isSubmitting || !name.trim() || averageServiceTimeMinutes <= 0;
    const isEditing = !!initialData;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="service-name" className="block text-sm font-medium text-text-secondary mb-1">
                    Service Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="service-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., General Check-ups"
                />
            </div>
            
            <div>
                <label htmlFor="service-time" className="block text-sm font-medium text-text-secondary mb-1">
                    Average Service Time (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                    id="service-time"
                    type="number"
                    value={averageServiceTimeMinutes}
                    onChange={(e) => setAverageServiceTimeMinutes(parseInt(e.target.value, 10))}
                    required
                    min="1"
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label htmlFor="service-image" className="block text-sm font-medium text-text-secondary mb-1">
                    Image URL (Optional)
                </label>
                <input
                    id="service-image"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-text-secondary/80 mt-1">If left blank, a random image will be used.</p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-foreground dark:bg-slate-700 hover:bg-border-color/50 dark:hover:bg-slate-600 text-text-primary dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-48"
                >
                    {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
                    ) : (
                        isEditing ? (
                            <>
                                <PencilIcon className="h-5 w-5" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <PlusIcon className="h-5 w-5" />
                                Create Service
                            </>
                        )
                    )}
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;