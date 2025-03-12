
// Mock user data for development
export type Person = {
  id: string;
  name: string;
  profileImage: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  reputationScore: number;
  lastContactedDate: string;
  socialMedia: {
    platform: string;
    url: string;
    username: string;
    icon: string;
  }[];
  relationshipStatus: 'New' | 'Active' | 'Inactive' | 'Close';
  meetings: {
    id: string;
    date: string;
    title: string;
    summary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  tasks: {
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
  }[];
  finances: {
    id: string;
    amount: number;
    currency: string;
    date: string;
    description: string;
    type: 'owed' | 'paid' | 'received';
  }[];
  timeline: {
    id: string;
    date: string;
    type: 'meeting' | 'task' | 'payment' | 'contact';
    title: string;
    description: string;
  }[];
};

// Import expanded dataset (100+ users)
import mockPeople100 from './mockPeople100.json';

// Our expanded dataset (typed as Person[])
export const mockPeople: Person[] = mockPeople100 as Person[];

export const findPersonByName = (name: string): Person | undefined => {
  return mockPeople.find(person => 
    person.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const getAllPeople = (): Person[] => {
  return mockPeople;
};
