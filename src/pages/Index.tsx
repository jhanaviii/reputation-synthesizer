
import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import LandingHero from '../components/LandingHero';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/ProfileCard';
import CommandInput from '../components/CommandInput';
import TaskManager from '../components/TaskManager';
import RelationshipTimeline from '../components/RelationshipTimeline';
import SocialMediaLinks from '../components/SocialMediaLinks';
import { findPersonByName, Person, getAllPeople } from '../utils/mockData';
import { toast } from "@/components/ui/use-toast";
import { generateRelationshipInsight } from '../utils/aiService';
import { checkBackendAvailability } from '../utils/apiService';

interface AIInsight {
  message: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidenceScore?: number;
  entities?: Array<{name: string, type: string}>;
  timeEstimate?: string;
}

const Index = () => {
  const [searchedPerson, setSearchedPerson] = useState<Person | null>(null);
  const [isCommandVisible, setIsCommandVisible] = useState(true);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<AIInsight | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  
  // Check backend availability on load
  useEffect(() => {
    const checkBackend = async () => {
      const available = await checkBackendAvailability();
      setIsBackendAvailable(available);
      
      if (available) {
        toast({
          title: "AI Backend Connected",
          description: "Using real AI models for enhanced features",
          duration: 3000,
        });
      }
    };
    
    checkBackend();
  }, []);
  
  // Load all people on mount
  useEffect(() => {
    setAllPeople(getAllPeople());
  }, []);
  
  const handleSearch = (query: string) => {
    const person = findPersonByName(query);
    
    if (person) {
      setSearchedPerson(person);
      setLastCommand(null);
      setAIResponse(null);
      
      toast({
        title: "Person found",
        description: `Found information for ${person.name}`,
        duration: 3000,
      });
      
      // Generate an initial AI insight about the relationship
      setTimeout(() => {
        const insight = generateRelationshipInsight(person);
        setAIResponse({
          message: insight,
          sentiment: 'positive',
          confidenceScore: Math.floor(Math.random() * 15) + 80 // 80-95% confidence
        });
      }, 1000);
      
    } else {
      toast({
        title: "Person not found",
        description: "We couldn't find anyone with that name",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const handleCommand = (command: string) => {
    setLastCommand(command);
    
    // AI response will come from the CommandInput component via the toast system
    // but we store the last command for display purposes
  };
  
  // Update the person data when tasks are added or completed
  const handlePersonUpdate = (updatedPerson: Person) => {
    setSearchedPerson(updatedPerson);
  };
  
  // Update AI response with new insights
  const handleAIResponse = (response: AIInsight) => {
    setAIResponse(response);
  };
  
  return (
    <MainLayout>
      {!searchedPerson ? (
        <>
          <LandingHero />
          <div className="container mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Find Anyone. Understand Your Relationship.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Search for a contact to view their online presence, manage your relationship, 
                and get AI-powered insights about your interactions.
              </p>
              {isBackendAvailable && (
                <div className="mt-2 text-sm text-primary font-medium">
                  AI Backend Connected: Using real ML models for enhanced features
                </div>
              )}
            </div>
            
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search for anyone, or see suggestions..."
            />
            
            {allPeople.length > 0 && (
              <div className="mt-10 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Dataset includes {allPeople.length} people - Try searching for one of these:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {allPeople.slice(0, 5).map(person => (
                    <button
                      key={person.id}
                      onClick={() => handleSearch(person.name)}
                      className="px-3 py-1 rounded-full bg-secondary/60 hover:bg-secondary transition-colors text-sm"
                    >
                      {person.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container mx-auto px-6 py-10">
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search for another person..."
              className="max-w-3xl"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard person={searchedPerson} />
              <SocialMediaLinks person={searchedPerson} />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className="premium-card p-6">
                <h2 className="text-lg font-semibold mb-4">Relationship AI Assistant</h2>
                
                {(lastCommand || aiResponse) && (
                  <div className="mb-6 p-4 rounded-lg bg-secondary/50 animate-scale-in">
                    {lastCommand && (
                      <>
                        <div className="text-sm font-medium mb-1">Your last command:</div>
                        <div className="text-sm">{lastCommand}</div>
                      </>
                    )}
                    
                    {aiResponse && (
                      <>
                        <div className="text-sm font-medium mb-1 flex items-center gap-2">
                          AI Insight 
                          {aiResponse.confidenceScore && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {aiResponse.confidenceScore}% confidence
                            </span>
                          )}
                          {aiResponse.sentiment && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              aiResponse.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              aiResponse.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {aiResponse.sentiment}
                            </span>
                          )}
                        </div>
                        <div className="text-sm whitespace-pre-line">{aiResponse.message}</div>
                        
                        {aiResponse.timeEstimate && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Time estimate: {aiResponse.timeEstimate}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                <CommandInput 
                  onSubmit={handleCommand} 
                  person={searchedPerson}
                  isExpanded={isCommandVisible}
                  onToggleExpand={() => setIsCommandVisible(!isCommandVisible)}
                  onAIResponse={handleAIResponse}
                />
              </div>
              
              <TaskManager 
                person={searchedPerson} 
                onPersonUpdate={handlePersonUpdate}
              />
              <RelationshipTimeline person={searchedPerson} />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
