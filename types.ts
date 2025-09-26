export type ServiceCategory = 'hospital';

export interface Person {
  id: string;
  name: string;
  joinedAt: Date;
  userId?: string;
}

export interface Location {
    id:string;
    name: string;
    address: string;
    openingTime: string;
    closingTime: string;
    category: ServiceCategory;
}

export interface Queue {
  id:string;
  name: string;
  averageServiceTimeMinutes: number;
  currentlyServing: Person | null;
  people: Person[];
  imageUrl: string;
  locationId: string;
  managedByStaffId?: string;
}

export interface User {
    id: string;
    name: string;
    points: number;
    age: number;
    status: string;
    photoUrl: string;
    role: 'customer' | 'admin';
    currentQueueId?: string | null;
    currentQueueName?: string | null;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: 'Active' | 'On Call' | 'Offline';
  photoUrl: string;
  locationId: string;
}