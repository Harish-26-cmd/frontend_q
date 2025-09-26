import type { Queue, Person, Location, ServiceCategory } from '../types';

const locations: Location[] = [
    { id: 'loc2', name: 'City General Hospital', address: '456 Health Ave, Metropolis', openingTime: '24 Hours', closingTime: '', category: 'hospital' },
    { id: 'loc5', name: 'Suburbia Medical Clinic', address: '654 Wellness Way, Suburbia', openingTime: '8:30 AM', closingTime: '5:30 PM', category: 'hospital' },
];

let queues: Queue[] = [
  {
    id: 'q2',
    name: 'General Check-ups',
    averageServiceTimeMinutes: 15,
    locationId: 'loc2',
    managedByStaffId: 'staff2',
    currentlyServing: null,
    people: [
      { id: 'p4', name: 'Eve Davis', joinedAt: new Date(Date.now() - 10 * 60000) },
      { id: 'p5', name: 'Frank White', joinedAt: new Date(Date.now() - 2 * 60000) },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'q5',
    name: 'Pharmacy',
    averageServiceTimeMinutes: 10,
    locationId: 'loc2',
    managedByStaffId: 'staff4',
    currentlyServing: { id: 'p12', name: 'Oscar Taylor', joinedAt: new Date() },
    people: [
      { id: 'p13', name: 'Peggy Hill', joinedAt: new Date(Date.now() - 8 * 60000) },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587374382229-3b14643b970a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
   {
    id: 'q7',
    name: 'Emergency Room',
    averageServiceTimeMinutes: 45,
    locationId: 'loc5',
    managedByStaffId: 'staff5',
    currentlyServing: { id: 'p16', name: 'Steve Rogers', joinedAt: new Date() },
    people: [],
    imageUrl: 'https://images.unsplash.com/photo-1627525345624-7835154d4bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getLocationsByCategory = async (category: ServiceCategory): Promise<Location[]> => {
    await simulateDelay(300);
    const filtered = locations.filter(loc => loc.category === category);
    return JSON.parse(JSON.stringify(filtered));
};

export const getLocationById = async (id: string): Promise<Location | undefined> => {
    await simulateDelay(100);
    const location = locations.find(loc => loc.id === id);
    return location ? JSON.parse(JSON.stringify(location)) : undefined;
};

export const addLocation = async (locationData: Omit<Location, 'id'>): Promise<Location> => {
    await simulateDelay(600);
    const newLocation: Location = {
        ...locationData,
        id: `loc${Date.now()}`,
    };
    locations.unshift(newLocation); // Add to the beginning of the array
    return JSON.parse(JSON.stringify(newLocation));
}

export const getQueues = async (filters: { locationId?: string | null } = {}): Promise<Queue[]> => {
  await simulateDelay(300);
  if (filters.locationId) {
    const filteredQueues = queues.filter(q => q.locationId === filters.locationId);
    return JSON.parse(JSON.stringify(filteredQueues));
  }
  return JSON.parse(JSON.stringify(queues)); // Deep copy to prevent mutation
};

export const getQueueById = async (id: string): Promise<Queue | undefined> => {
  await simulateDelay(200);
  const queue = queues.find(q => q.id === id);
  return queue ? JSON.parse(JSON.stringify(queue)) : undefined;
};

export const addQueue = async (queueData: Omit<Queue, 'id' | 'people' | 'currentlyServing' | 'managedByStaffId'>): Promise<Queue> => {
    await simulateDelay(600);
    const newQueue: Queue = {
        ...queueData,
        id: `q${Date.now()}`,
        people: [],
        currentlyServing: null,
    };
    queues.unshift(newQueue);
    return JSON.parse(JSON.stringify(newQueue));
};

export const updateQueue = async (queueId: string, updates: Partial<Omit<Queue, 'id'>>): Promise<Queue | undefined> => {
    await simulateDelay(400);
    const queueIndex = queues.findIndex(q => q.id === queueId);
    if (queueIndex !== -1) {
        queues[queueIndex] = { ...queues[queueIndex], ...updates };
        return JSON.parse(JSON.stringify(queues[queueIndex]));
    }
    return undefined;
};

export const deleteQueue = async (queueId: string): Promise<{ success: boolean }> => {
    await simulateDelay(500);
    const initialLength = queues.length;
    queues = queues.filter(q => q.id !== queueId);
    return { success: queues.length < initialLength };
};

export const callNextPerson = async (queueId: string): Promise<Queue | undefined> => {
  await simulateDelay(400);
  const queue = queues.find(q => q.id === queueId);
  if (queue && queue.people.length > 0) {
    const nextPerson = queue.people.shift();
    if(nextPerson) {
        queue.currentlyServing = nextPerson;
    }
  }
  return queue ? JSON.parse(JSON.stringify(queue)) : undefined;
};

export const addPersonToQueue = async (queueId: string, name: string, userId?: string): Promise<Queue | { error: string } | undefined> => {
  await simulateDelay(400);
  
  // Check if user is already in any queue, but only if they are a registered user (have a userId)
  if (userId) {
    const isAlreadyInQueue = queues.some(q => q.people.some(p => p.userId === userId));
    if (isAlreadyInQueue) {
        return { error: 'You are already in a queue. Please leave your current queue first.' };
    }
  }

  const queue = queues.find(q => q.id === queueId);
  if (queue) {
    const newPerson: Person = {
      id: `p${Date.now()}`,
      name,
      joinedAt: new Date(),
    };
    if (userId) {
        newPerson.userId = userId;
    }
    queue.people.push(newPerson);
  }
  return queue ? JSON.parse(JSON.stringify(queue)) : undefined;
};


export const removePersonFromQueue = async (queueId: string, userId: string): Promise<Queue | undefined> => {
    await simulateDelay(400);
    const queue = queues.find(q => q.id === queueId);
    if(queue) {
        const personIndex = queue.people.findIndex(p => p.userId === userId);
        if (personIndex > -1) {
            queue.people.splice(personIndex, 1);
        }
    }
    return queue ? JSON.parse(JSON.stringify(queue)) : undefined;
};

export const removeSpecificPersonFromQueue = async (queueId: string, personId: string): Promise<Queue | undefined> => {
    await simulateDelay(400);
    const queue = queues.find(q => q.id === queueId);
    if(queue) {
        const personIndex = queue.people.findIndex(p => p.id === personId);
        if (personIndex > -1) {
            queue.people.splice(personIndex, 1);
        }
    }
    return queue ? JSON.parse(JSON.stringify(queue)) : undefined;
};