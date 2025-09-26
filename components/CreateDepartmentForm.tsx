import React, { useState } from 'react';
import type { Location } from '../types';
import { PlusIcon } from './icons';

interface CreateDepartmentFormProps {
    onSubmit: (data: Omit<Location, 'id' | 'category'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [openingTime, setOpeningTime] = useState('09:00');
    const [closingTime, setClosingTime] = useState('17:00');
    const [is24Hours, setIs24Hours] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !address) {
            alert('Please fill out all required fields.');
            return;
        }

        onSubmit({
            name,
            address,
            openingTime: is24Hours ? '24 Hours' : openingTime,
            closingTime: is24Hours ? '' : closingTime,
        });
    };

    const isSubmitDisabled = isSubmitting || !name.trim() || !address.trim();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="dept-name" className="block text-sm font-medium text-text-secondary mb-1">
                    Department Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="dept-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Cardiology Wing"
                />
            </div>
             <div>
                <label htmlFor="dept-address" className="block text-sm font-medium text-text-secondary mb-1">
                    Location / Address <span className="text-red-500">*</span>
                </label>
                <input
                    id="dept-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Building B, Floor 3"
                />
            </div>

            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    id="is24Hours"
                    checked={is24Hours}
                    onChange={(e) => setIs24Hours(e.target.checked)}
                    className="h-4 w-4 rounded border-border-color text-primary focus:ring-primary"
                />
                <label htmlFor="is24Hours" className="text-sm font-medium text-text-secondary">
                    Open 24 Hours
                </label>
            </div>
            
            {!is24Hours && (
                <div className="grid grid-cols-2 gap-4 animate-slide-down-fade-in">
                    <div>
                        <label htmlFor="opening-time" className="block text-sm font-medium text-text-secondary mb-1">Opening Time</label>
                        <input
                            id="opening-time"
                            type="time"
                            value={openingTime}
                            onChange={(e) => setOpeningTime(e.target.value)}
                            className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary"
                        />
                    </div>
                     <div>
                        <label htmlFor="closing-time" className="block text-sm font-medium text-text-secondary mb-1">Closing Time</label>
                        <input
                            id="closing-time"
                            type="time"
                            value={closingTime}
                            onChange={(e) => setClosingTime(e.target.value)}
                             className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary"
                        />
                    </div>
                </div>
            )}

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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-40"
                >
                    {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
                    ) : (
                        <>
                            <PlusIcon className="h-5 w-5" />
                            Create
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default CreateDepartmentForm;