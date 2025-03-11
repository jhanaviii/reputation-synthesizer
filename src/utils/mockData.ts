
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

export const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Alex Chen',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Product Designer',
    company: 'Designify',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567',
    reputationScore: 85,
    lastContactedDate: '2023-06-15',
    socialMedia: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/alexchen',
        username: 'alexchen',
        icon: 'linkedin'
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/alexchendesign',
        username: 'alexchendesign',
        icon: 'twitter'
      },
      {
        platform: 'Dribbble',
        url: 'https://dribbble.com/alexchen',
        username: 'alexchen',
        icon: 'dribbble'
      }
    ],
    relationshipStatus: 'Active',
    meetings: [
      {
        id: 'm1',
        date: '2023-06-10',
        title: 'Website Redesign Kickoff',
        summary: 'Discussed project goals, timeline, and deliverables for the website redesign project. Alex presented initial mood boards and wireframes. We agreed on a minimalist approach with a focus on user experience.',
        sentiment: 'positive'
      },
      {
        id: 'm2',
        date: '2023-05-22',
        title: 'Design Review',
        summary: 'Reviewed the latest design iterations. Made some adjustments to the color scheme and typography. Overall, the project is on track.',
        sentiment: 'neutral'
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Send final homepage designs',
        dueDate: '2023-06-20',
        status: 'in-progress',
        priority: 'high'
      },
      {
        id: 't2',
        title: 'Review user flow diagrams',
        dueDate: '2023-06-25',
        status: 'pending',
        priority: 'medium'
      }
    ],
    finances: [
      {
        id: 'f1',
        amount: 500,
        currency: 'USD',
        date: '2023-05-15',
        description: 'Initial design consultation',
        type: 'paid'
      }
    ],
    timeline: [
      {
        id: 'tl1',
        date: '2023-06-10',
        type: 'meeting',
        title: 'Website Redesign Kickoff',
        description: 'Initial project meeting to discuss goals and timeline'
      },
      {
        id: 'tl2',
        date: '2023-05-22',
        type: 'meeting',
        title: 'Design Review',
        description: 'Review of initial design concepts'
      },
      {
        id: 'tl3',
        date: '2023-05-15',
        type: 'payment',
        title: 'Initial payment',
        description: 'Received $500 for initial design consultation'
      }
    ]
  },
  {
    id: '2',
    name: 'Samantha Taylor',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Marketing Director',
    company: 'GrowthLabs',
    email: 'sam.taylor@example.com',
    phone: '+1 (555) 987-6543',
    reputationScore: 92,
    lastContactedDate: '2023-06-05',
    socialMedia: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/samtaylor',
        username: 'samtaylor',
        icon: 'linkedin'
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/samtaylormarketing',
        username: 'samtaylormarketing',
        icon: 'twitter'
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/samtaylor',
        username: 'samtaylor',
        icon: 'instagram'
      }
    ],
    relationshipStatus: 'Close',
    meetings: [
      {
        id: 'm1',
        date: '2023-06-05',
        title: 'Q3 Marketing Strategy',
        summary: 'Outlined the marketing strategy for Q3. Key focus areas include social media campaigns, content marketing, and influencer partnerships. Budget approved for all proposed initiatives.',
        sentiment: 'positive'
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Finalize influencer list',
        dueDate: '2023-06-18',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 't2',
        title: 'Review content calendar',
        dueDate: '2023-06-22',
        status: 'pending',
        priority: 'medium'
      }
    ],
    finances: [
      {
        id: 'f1',
        amount: 1200,
        currency: 'USD',
        date: '2023-05-30',
        description: 'Marketing consultation retainer',
        type: 'received'
      }
    ],
    timeline: [
      {
        id: 'tl1',
        date: '2023-06-05',
        type: 'meeting',
        title: 'Q3 Marketing Strategy',
        description: 'Strategic planning meeting for upcoming quarter'
      },
      {
        id: 'tl2',
        date: '2023-05-30',
        type: 'payment',
        title: 'Monthly retainer',
        description: 'Received $1200 for marketing consultation'
      }
    ]
  },
  {
    id: '3',
    name: 'David Kim',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Backend Developer',
    company: 'TechStack',
    email: 'david.kim@example.com',
    phone: '+1 (555) 765-4321',
    reputationScore: 78,
    lastContactedDate: '2023-05-20',
    socialMedia: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/davidkim',
        username: 'davidkim',
        icon: 'linkedin'
      },
      {
        platform: 'GitHub',
        url: 'https://github.com/davidkim',
        username: 'davidkim',
        icon: 'github'
      },
      {
        platform: 'StackOverflow',
        url: 'https://stackoverflow.com/users/davidkim',
        username: 'davidkim',
        icon: 'stack-overflow'
      }
    ],
    relationshipStatus: 'Active',
    meetings: [
      {
        id: 'm1',
        date: '2023-05-20',
        title: 'API Integration Planning',
        summary: 'Discussed the requirements for integrating the new payment API. David provided valuable insights on potential challenges and security considerations.',
        sentiment: 'neutral'
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Implement payment gateway',
        dueDate: '2023-06-30',
        status: 'in-progress',
        priority: 'high'
      }
    ],
    finances: [],
    timeline: [
      {
        id: 'tl1',
        date: '2023-05-20',
        type: 'meeting',
        title: 'API Integration Planning',
        description: 'Technical discussion about payment API integration'
      },
      {
        id: 'tl2',
        date: '2023-05-18',
        type: 'task',
        title: 'Task assigned',
        description: 'Assigned payment gateway implementation task'
      }
    ]
  }
];

export const findPersonByName = (name: string): Person | undefined => {
  return mockPeople.find(person => 
    person.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const getAllPeople = (): Person[] => {
  return mockPeople;
};
