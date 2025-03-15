
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
  location?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
  };
}

/**
 * Search for profiles online
 */
export const searchProfiles = async (query: string): Promise<ProfileSearchResult[]> => {
  try {
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      console.log('Backend API available, searching profiles with query:', query);
      
      // Show toast to indicate search is in progress
      const searchToast = toast({
        title: "Searching online profiles",
        description: `Looking for "${query}" on LinkedIn, Google, and other platforms...`,
        duration: 60000, // 60 seconds timeout (increased from 10 seconds)
      });
      
      try {
        const response = await axios.get(`${API_URL}/profiles/search`, {
          params: { query },
          timeout: 60000 // Increase timeout to 60 seconds for web scraping operations (from 45 seconds)
        });
        
        // Dismiss the loading toast
        searchToast.dismiss?.();
        
        console.log('Search response status:', response.status);
        console.log('Search results count:', response.data?.length || 0);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          toast({
            title: "Search successful",
            description: `Found ${response.data.length} results for "${query}"`,
            duration: 3000,
          });
          return response.data;
        } else {
          console.warn('Backend returned empty results for query:', query);
          toast({
            title: "No results found",
            description: `No online profiles found for "${query}". Try a different name or search term.`,
            variant: "destructive",
            duration: 3000,
          });
          return [];
        }
      } catch (error: any) {
        // Dismiss the loading toast
        searchToast.dismiss?.();
        
        console.error('Error from backend search API:', error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        
        toast({
          title: "Search error",
          description: "The backend encountered an error while searching. Using sample data instead.",
          variant: "destructive",
          duration: 3000,
        });
        
        // Return mock data as fallback
        return generateMockProfileResults(query);
      }
    } else {
      console.log('Backend API is not available, using fallback data');
      toast({
        title: "Backend unavailable",
        description: "Using sample data instead of real online search",
        variant: "destructive",
        duration: 3000,
      });
      // Return mock data as fallback
      return generateMockProfileResults(query);
    }
  } catch (error) {
    console.error('Error searching profiles:', error);
    toast({
      title: "Search error",
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
      console.log('Backend API available, fetching profile details...');
      const response = await axios.get(`${API_URL}/profiles/details`, {
        params: { profileUrl },
        timeout: 30000 // Increase timeout to 30 seconds for web scraping operations
      });
      
      console.log('Profile details:', response.data);
      
      if (response.data) {
        return {
          ...response.data,
          // Ensure the returned data conforms to Person type
          relationshipStatus: response.data.relationshipStatus as 'New' | 'Active' | 'Inactive' | 'Close',
          notes: [],
          tasks: [],
          meetings: [],
          timeline: [
            {
              id: `tl_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              type: 'contact',
              title: 'Added as contact',
              description: `${response.data.name} was added to your contacts`
            }
          ],
          socialMedia: [],
          finances: []
        };
      } else {
        throw new Error("No profile details returned");
      }
    } else {
      console.log('Backend API is not available, using fallback data');
      toast({
        title: "Backend unavailable",
        description: "Using sample data instead of real profile details",
        variant: "destructive",
        duration: 3000,
      });
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
      console.log('Backend API available, adding person...');
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
  const companies = ['TechCorp', 'InnovateSoft', 'DataSystems', 'CloudNine', 'FutureTech', 'AI Solutions', 'Digital Trends', 'Global Insights'];
  const roles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Marketing Specialist', 'Data Scientist', 'CEO', 'CTO', 'Sales Director'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO'];
  
  // Special handling for well-known people
  if (query.toLowerCase().includes('elon musk')) {
    return [{
      name: "Elon Musk",
      company: "X Corp, SpaceX, Tesla",
      role: "CEO",
      profileUrl: "https://linkedin.com/in/elon-musk",
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/330px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
      location: "Austin, TX",
      bio: "Elon Musk is the CEO of Tesla, SpaceX, Neuralink, and X Corp.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/elonmusk",
        twitter: "https://twitter.com/elonmusk"
      }
    }];
  } else if (query.toLowerCase().includes('bill gates')) {
    return [{
      name: "Bill Gates",
      company: "Bill & Melinda Gates Foundation",
      role: "Co-chair",
      profileUrl: "https://linkedin.com/in/williamhgates",
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg",
      location: "Seattle, WA",
      bio: "Bill Gates is a co-founder of Microsoft Corporation and now focuses on philanthropy through the Bill & Melinda Gates Foundation.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/williamhgates",
        twitter: "https://twitter.com/BillGates"
      }
    }];
  } else if (query.toLowerCase().includes('sundar pichai')) {
    return [{
      name: "Sundar Pichai",
      company: "Google, Alphabet",
      role: "CEO",
      profileUrl: "https://linkedin.com/in/sundar-pichai",
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Sundar_Pichai_WEF_2020.png/330px-Sundar_Pichai_WEF_2020.png",
      location: "San Francisco Bay Area",
      bio: "Sundar Pichai is the CEO of Google and its parent company Alphabet.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/sundar-pichai",
        twitter: "https://twitter.com/sundarpichai"
      }
    }];
  }
  
  // Generate 3-5 mock profiles
  const count = Math.floor(Math.random() * 3) + 3;
  
  return Array.from({ length: count }, (_, i) => {
    const name = `${query} ${String.fromCharCode(65 + i)}`;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      name,
      profileUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s/g, '-')}`,
      company,
      role,
      location,
      profileImage: `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random`,
      bio: `${name} is a ${role} at ${company} based in ${location}.`,
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
  const companies = ['TechCorp', 'InnovateSoft', 'DataSystems', 'CloudNine', 'FutureTech', 'AI Solutions', 'Digital Trends', 'Global Insights'];
  const roles = ['Software Engineer', 'Product Manager', 'UX Designer', 'Marketing Specialist', 'Data Scientist', 'CEO', 'CTO', 'Sales Director'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO'];
  
  const company = companies[Math.floor(Math.random() * companies.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    name,
    company,
    role,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@${company.toLowerCase().replace(/\s/g, '')}.com`,
    phone: `+1${Math.floor(Math.random() * 10000000000)}`,
    profileImage: `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random`,
    bio: `${name} is a ${role} at ${company} with expertise in various aspects of technology and innovation. Based in ${location}.`,
    location,
    website: `https://${name.toLowerCase().replace(/\s/g, '')}.com`,
    socialLinks: {
      linkedin: profileUrl,
      twitter: Math.random() > 0.5 ? `https://twitter.com/${name.toLowerCase().replace(/\s/g, '')}` : undefined,
      github: Math.random() > 0.7 ? `https://github.com/${name.toLowerCase().replace(/\s/g, '')}` : undefined,
    },
    relationshipStatus: (['New', 'Active', 'Inactive', 'Close'][Math.floor(Math.random() * 4)] as 'New' | 'Active' | 'Inactive' | 'Close'),
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
    profileImage: personData.profileImage || `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random`,
    bio: personData.bio || `${name} is a professional with various skills and expertise.`,
    location: personData.location || 'Unknown Location',
    website: personData.website || '',
    socialLinks: personData.socialLinks || {},
    relationshipStatus: personData.relationshipStatus as 'New' | 'Active' | 'Inactive' | 'Close' || 'New',
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
    socialMedia: [],
    finances: [],
  };
};
