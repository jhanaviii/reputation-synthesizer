
import axios from 'axios';
import { Person } from './mockData';
import { toast } from "@/components/ui/use-toast";
import { checkBackendAvailability } from './apiService';

const API_URL = 'http://localhost:5000/api';

// Interface for profile search results
interface ProfileSearchResult {
  name: string;
  profileUrl: string;
  company?: string;
  role?: string;
  profileImage?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

/**
 * Search for profiles online
 */
export const searchProfiles = async (query: string): Promise<ProfileSearchResult[]> => {
  try {
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      const response = await axios.get(`${API_URL}/profiles/search`, {
        params: { query }
      });
      
      return response.data;
    } else {
      console.log('Backend API is not available, using fallback data');
      // Return mock data as fallback
      return generateMockProfileResults(query);
    }
  } catch (error) {
    console.error('Error searching profiles:', error);
    toast({
      title: "Error",
      description: "Failed to search profiles. Using sample data instead.",
      variant: "destructive",
      duration: 3000,
    });
    
    // Return mock data as fallback
    return generateMockProfileResults(query);
  }
};

/**
 * Fetch detailed profile data
 */
export const fetchProfileDetails = async (profileUrl: string): Promise<Partial<Person>> => {
  try {
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      const response = await axios.get(`${API_URL}/profiles/details`, {
        params: { profileUrl }
      });
      
      return response.data;
    } else {
      console.log('Backend API is not available, using fallback data');
      // Return mock data as fallback
      return generateMockProfileDetails(profileUrl);
    }
  } catch (error) {
    console.error('Error fetching profile details:', error);
    toast({
      title: "Error",
      description: "Failed to fetch profile details. Using generated data instead.",
      variant: "destructive",
      duration: 3000,
    });
    
    // Return mock data as fallback
    return generateMockProfileDetails(profileUrl);
  }
};

/**
 * Add a new person to the system
 */
export const addPerson = async (personData: Partial<Person>): Promise<Person | null> => {
  try {
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      const response = await axios.post(`${API_URL}/people`, personData);
      
      toast({
        title: "Success",
        description: `${personData.name} has been added to your contacts.`,
        duration: 3000,
      });
      
      return response.data;
    } else {
      console.log('Backend API is not available, using fallback');
      // Return mock data as fallback
      const mockPerson = createMockPerson(personData);
      
      toast({
        title: "Contact Added (Offline Mode)",
        description: `${personData.name} has been added to your contacts.`,
        duration: 3000,
      });
      
      return mockPerson;
    }
  } catch (error) {
    console.error('Error adding person:', error);
    toast({
      title: "Error",
      description: "Failed to add contact. Please try again.",
      variant: "destructive",
      duration: 3000,
    });
    
    return null;
  }
};

// Helper function to generate mock profile search results
const generateMockProfileResults = (query: string): ProfileSearchResult[] => {
  const companies = ['TechCorp', 'InnovateSoft', 'DataSystems', 'CloudNine', 'FutureTech'];
  const roles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Marketing Specialist', 'Data Scientist'];
  
  // Generate 3-5 mock profiles
  const count = Math.floor(Math.random() * 3) + 3;
  
  return Array.from({ length: count }, (_, i) => {
    const name = `${query} ${String.fromCharCode(65 + i)}`;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    return {
      name,
      profileUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s/g, '-')}`,
      company,
      role,
      profileImage: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
      socialLinks: {
        linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/\s/g, '-')}`,
        twitter: Math.random() > 0.5 ? `https://twitter.com/${name.toLowerCase().replace(/\s/g, '')}` : undefined,
        github: Math.random() > 0.7 ? `https://github.com/${name.toLowerCase().replace(/\s/g, '')}` : undefined,
      }
    };
  });
};

// Helper function to generate mock profile details
const generateMockProfileDetails = (profileUrl: string): Partial<Person> => {
  const name = profileUrl.split('/').pop()?.replace(/-/g, ' ') || 'Unknown Person';
  const companies = ['TechCorp', 'InnovateSoft', 'DataSystems', 'CloudNine', 'FutureTech'];
  const roles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Marketing Specialist', 'Data Scientist'];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  
  return {
    name,
    company,
    role,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@${company.toLowerCase().replace(/\s/g, '')}.com`,
    phone: `+1${Math.floor(Math.random() * 1000000000)}`,
    profileImage: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
    bio: `${name} is a ${role} at ${company} with expertise in various aspects of technology and innovation.`,
    location: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'][Math.floor(Math.random() * 5)],
    website: `https://${name.toLowerCase().replace(/\s/g, '')}.com`,
    socialLinks: {
      linkedin: profileUrl,
      twitter: Math.random() > 0.5 ? `https://twitter.com/${name.toLowerCase().replace(/\s/g, '')}` : undefined,
      github: Math.random() > 0.7 ? `https://github.com/${name.toLowerCase().replace(/\s/g, '')}` : undefined,
    },
    relationshipStatus: ['New', 'Active', 'Inactive', 'Close'][Math.floor(Math.random() * 4)] as 'New' | 'Active' | 'Inactive' | 'Close',
    reputationScore: Math.floor(Math.random() * 50) + 50,
  };
};

// Helper function to create a full mock person
const createMockPerson = (personData: Partial<Person>): Person => {
  const id = `p${Date.now()}`;
  const name = personData.name || 'Unknown Person';
  
  return {
    id,
    name,
    company: personData.company || 'Unknown Company',
    role: personData.role || 'Unknown Role',
    email: personData.email || `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    phone: personData.phone || '+1234567890',
    profileImage: personData.profileImage || `https://i.pravatar.cc/150?u=${id}`,
    bio: personData.bio || `${name} is a professional with various skills and expertise.`,
    location: personData.location || 'Unknown Location',
    website: personData.website || '',
    socialLinks: personData.socialLinks || {},
    relationshipStatus: personData.relationshipStatus || 'New',
    reputationScore: personData.reputationScore || Math.floor(Math.random() * 50) + 50,
    lastContactedDate: new Date().toISOString().split('T')[0],
    tasks: [],
    meetings: [],
    timeline: [
      {
        id: `tl_${id}_1`,
        date: new Date().toISOString().split('T')[0],
        type: 'contact',
        title: 'Added as contact',
        description: `${name} was added to your contacts`
      }
    ],
    notes: [],
    socialMedia: [], // Add empty array for socialMedia
    finances: [], // Add empty array for finances
  };
};
