
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Calendar, CheckSquare, LineChart, Clock, Plus, MessageSquare } from 'lucide-react';
import { useFadeIn } from '../utils/animations';
import { mockPeople } from '../utils/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Avatar } from './ui/avatar';
import { AddContactDialog } from './AddContactDialog';

export const LandingHero = () => {
  const { domRef, isVisible } = useFadeIn();
  const [typedText, setTypedText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const phrases = [
    'Track relationships.',
    'Monitor online presence.',
    'Manage tasks seamlessly.',
    'Store financial details.',
    'Analyze conversations.',
  ];
  const phrasesRef = useRef(0);
  const charsRef = useRef(0);
  const typingSpeedRef = useRef(50);
  const deleteSpeedRef = useRef(30);
  const delayRef = useRef(2000);
  const isDeleting = useRef(false);
  
  // Get sample data for dashboard preview
  const samplePeople = mockPeople.slice(0, 4);
  const sampleTasks = mockPeople
    .slice(0, 3)
    .flatMap(person => person.tasks.slice(0, 2))
    .slice(0, 5);
  
  useEffect(() => {
    const typeWriter = () => {
      const currentPhrase = phrases[phrasesRef.current];
      
      if (isDeleting.current) {
        setTypedText(currentPhrase.substring(0, charsRef.current - 1));
        charsRef.current -= 1;
        
        if (charsRef.current === 0) {
          isDeleting.current = false;
          phrasesRef.current = (phrasesRef.current + 1) % phrases.length;
        }
      } else {
        setTypedText(currentPhrase.substring(0, charsRef.current + 1));
        charsRef.current += 1;
        
        if (charsRef.current === currentPhrase.length) {
          isDeleting.current = true;
          setTimeout(() => {}, delayRef.current);
        }
      }
      
      const speed = isDeleting.current ? deleteSpeedRef.current : typingSpeedRef.current;
      setTimeout(typeWriter, speed);
    };
    
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle contact added
  const handleContactAdded = () => {
    // Force refresh of the dashboard preview
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div 
      ref={domRef}
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-8 rounded-full bg-secondary text-sm font-semibold">
          Relationship management reimagined
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Intelligent insights for your personal & professional relationships
        </h1>
        
        <div className="h-20 flex items-center justify-center">
          <h2 className="text-xl md:text-3xl text-muted-foreground font-medium">
            <span>{typedText}</span>
            <span className="inline-block w-1 h-8 bg-primary ml-1 animate-pulse"></span>
          </h2>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary/50">
            Get Started
          </button>
          
          <button className="px-8 py-3 rounded-full bg-secondary text-foreground font-medium transition-all flex items-center gap-2 hover:gap-3">
            <span>See how it works</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mt-20 relative" key={refreshKey}>
        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl animate-float premium-card bg-background border border-border">
          <div className="w-full h-full p-4 md:p-6">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Relationship Dashboard</h3>
                <p className="text-muted-foreground text-sm">Manage your network effectively</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-md bg-secondary text-xs">
                  <Clock className="h-3.5 w-3.5 inline mr-1" />
                  Last 30 days
                </button>
                <AddContactDialog onContactAdded={handleContactAdded} />
              </div>
            </div>
            
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Contacts Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Recent Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {samplePeople.map((person) => (
                      <div key={person.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/20 transition-colors">
                        <Avatar className="h-8 w-8">
                          <img src={person.profileImage} alt={person.name} className="h-full w-full object-cover" />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{person.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{person.company}</p>
                        </div>
                        <div className="text-xs px-1.5 py-0.5 rounded bg-secondary">
                          {person.relationshipStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Tasks Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                    Pending Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/20 transition-colors">
                        <div className={`h-2 w-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`} />
                        <p className="text-xs flex-1 truncate">{task.title}</p>
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Analytics Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <LineChart className="h-4 w-4 mr-2 text-primary" />
                    Relationship Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Active Relationships</span>
                      <div className="w-2/3 bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <span className="text-xs font-medium">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Follow-up Rate</span>
                      <div className="w-2/3 bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                      <span className="text-xs font-medium">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Task Completion</span>
                      <div className="w-2/3 bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-xs font-medium">75%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-4">
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Recent Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {mockPeople.slice(0, 3).map((person) => (
                      person.meetings[0] && (
                        <div key={person.meetings[0].id} className="p-3 rounded-md border border-border hover:bg-secondary/10 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <img src={person.profileImage} alt={person.name} className="h-full w-full object-cover" />
                            </Avatar>
                            <p className="text-xs font-medium truncate">{person.name}</p>
                          </div>
                          <p className="text-xs font-medium truncate mb-1">{person.meetings[0].title}</p>
                          <p className="text-xs text-muted-foreground truncate mb-2">{person.meetings[0].summary}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{person.meetings[0].date}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              person.meetings[0].sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              person.meetings[0].sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {person.meetings[0].sentiment}
                            </span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/4 w-32 h-32 rounded-full bg-primary/20 backdrop-blur-xl animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4 w-40 h-40 rounded-full bg-accent/20 backdrop-blur-xl animate-pulse-subtle"></div>
      </div>
    </div>
  );
};

export default LandingHero;
