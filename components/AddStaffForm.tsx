import React, { useState } from 'react';
import type { Staff } from '../types';
import { PlusIcon } from './icons';

interface AddStaffFormProps {
    onSubmit: (data: Omit<Staff, 'id' | 'locationId'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('Doctor');
    const [specialty, setSpecialty] = useState('');
    const [status, setStatus] = useState<'Active' | 'On Call' | 'Offline'>('Active');
    const [photoUrl, setPhotoUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !role.trim() || !specialty.trim()) {
            alert('Please fill out all required fields.');
            return;
        }

        onSubmit({
            name,
            role,
            specialty,
            status,
            photoUrl: photoUrl.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
        });
    };
    
    const isSubmitDisabled = isSubmitting || !name.trim() || !role.trim() || !specialty.trim();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="staff-name" className="block text-sm font-medium text-text-secondary mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="staff-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Dr. Jane Smith"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="staff-role" className="block text-sm font-medium text-text-secondary mb-1">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="staff-role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary"
                        placeholder="e.g., Doctor, Nurse"
                    />
                </div>
                 <div>
                    <label htmlFor="staff-specialty" className="block text-sm font-medium text-text-secondary mb-1">
                        Specialty <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="staff-specialty"
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                        className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary"
                        placeholder="e.g., Cardiologist"
                    />
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-text-secondary mb-2">
                    Status <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                    {(['Active', 'On Call', 'Offline'] as const).map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value={s}
                                checked={status === s}
                                onChange={() => setStatus(s)}
                                className="h-4 w-4 text-primary focus:ring-primary border-border-color"
                            />
                            <span className="text-sm font-medium text-text-secondary">{s}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="staff-photo" className="block text-sm font-medium text-text-secondary mb-1">
                    Photo URL (Optional)
                </label>
                <input
                    id="staff-photo"
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/photo.jpg"
                />
                 <p className="text-xs text-text-secondary/80 mt-1">If left blank, a random avatar will be generated.</p>
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-40"
                >
                    {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <PlusIcon className="h-5 w-5" />
                            Add Staff
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddStaffForm;