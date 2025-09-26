import type { Staff } from '../types';

const staff: Staff[] = [
    // City General Hospital Staff
    {
        id: 'staff1',
        name: 'Dr. Evelyn Reed',
        role: 'Doctor',
        specialty: 'Cardiologist',
        status: 'Active',
        photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        locationId: 'loc2'
    },
    {
        id: 'staff2',
        name: 'Dr. Ben Carter',
        role: 'Doctor',
        specialty: 'Neurologist',
        status: 'Active',
        photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
        locationId: 'loc2'
    },
    {
        id: 'staff3',
        name: 'Dr. Olivia Chen',
        role: 'Doctor',
        specialty: 'Pediatrician',
        status: 'On Call',
        photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        locationId: 'loc2'
    },
    {
        id: 'staff4',
        name: 'Nurse Michael P.',
        role: 'Nurse',
        specialty: 'General Practice',
        status: 'Active',
        photoUrl: 'https://randomuser.me/api/portraits/men/43.jpg',
        locationId: 'loc2'
    },

    // Suburbia Medical Clinic Staff
    {
        id: 'staff5',
        name: 'Dr. Samuel Green',
        role: 'Doctor',
        specialty: 'General Practitioner',
        status: 'Active',
        photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        locationId: 'loc5'
    },
    {
        id: 'staff6',
        name: 'Dr. Hannah Wright',
        role: 'Doctor',
        specialty: 'Dermatologist',
        status: 'Offline',
        photoUrl: 'https://randomuser.me/api/portraits/women/42.jpg',
        locationId: 'loc5'
    },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getStaffByLocation = async (locationId: string): Promise<Staff[]> => {
    await simulateDelay(500);
    const filteredStaff = staff.filter(s => s.locationId === locationId);
    return JSON.parse(JSON.stringify(filteredStaff));
};

export const addStaff = async (staffData: Omit<Staff, 'id'>): Promise<Staff> => {
    await simulateDelay(600);
    const newStaff: Staff = {
        ...staffData,
        id: `staff${Date.now()}`,
    };
    staff.unshift(newStaff); // Add to the beginning of the array
    return JSON.parse(JSON.stringify(newStaff));
};
