
import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import LandingHero from '../components/LandingHero';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/ProfileCard';
import CommandInput from '../components/CommandInput';
import TaskManager from '../components/TaskManager';
import RelationshipTimeline from '../components/RelationshipTimeline';
import SocialMediaLinks from '../components/SocialMediaLinks';
import { findPersonByName, Person } from '../utils/mockData';
import { toast } from "@/components/ui/use-toast";
import { generateRelationshipInsight } from '../utils/aiService';

const Index = () => {
  const [searchedPerson, setSearchedPerson] = useState<Person | null>(null);
  const [isCommandVisible, setIsCommandVisible] = useState(true);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  
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
        setAIResponse(insight);
      }, 1500);
      
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
            </div>
            
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Try searching for 'Alex', 'Samantha', or 'David'..."
            />
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
                    
                    {aiResponse && !lastCommand && (
                      <>
                        <div className="text-sm font-medium mb-1">AI Insight:</div>
                        <div className="text-sm">{aiResponse}</div>
                      </>
                    )}
                  </div>
                )}
                
                <CommandInput 
                  onSubmit={handleCommand} 
                  person={searchedPerson}
                  isExpanded={isCommandVisible}
                  onToggleExpand={() => setIsCommandVisible(!isCommandVisible)}
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
