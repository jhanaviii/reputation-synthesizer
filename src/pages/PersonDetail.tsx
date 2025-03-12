
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Person, findPersonById } from '../utils/mockData';
import ProfileCard from '../components/ProfileCard';
import CommandInput from '../components/CommandInput';
import TaskManager from '../components/TaskManager';
import RelationshipTimeline from '../components/RelationshipTimeline';
import SocialMediaLinks from '../components/SocialMediaLinks';
import { toast } from "@/components/ui/use-toast";
import { generateRelationshipInsight } from '../utils/aiService';

const PersonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [isCommandVisible, setIsCommandVisible] = useState(true);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<any | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundPerson = findPersonById(id);
      if (foundPerson) {
        setPerson(foundPerson);
        
        // Generate an initial AI insight about the relationship
        setTimeout(() => {
          const insight = generateRelationshipInsight(foundPerson);
          setAIResponse({
            message: insight,
            sentiment: 'positive',
            confidenceScore: Math.floor(Math.random() * 15) + 80 // 80-95% confidence
          });
        }, 1000);
      } else {
        toast({
          title: "Person not found",
          description: `We couldn't find anyone with ID: ${id}`,
          variant: "destructive",
          duration: 3000,
        });
        navigate('/');
      }
    }
  }, [id, navigate]);
  
  const handleCommand = (command: string) => {
    setLastCommand(command);
  };
  
  // Update the person data when tasks are added or completed
  const handlePersonUpdate = (updatedPerson: Person) => {
    setPerson(updatedPerson);
  };
  
  // Update AI response with new insights
  const handleAIResponse = (response: any) => {
    setAIResponse(response);
  };
  
  if (!person) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="animate-pulse">
            <p className="text-lg text-muted-foreground">Loading person details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard person={person} />
            <SocialMediaLinks person={person} />
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
                person={person}
                isExpanded={isCommandVisible}
                onToggleExpand={() => setIsCommandVisible(!isCommandVisible)}
                onAIResponse={handleAIResponse}
              />
            </div>
            
            <TaskManager 
              person={person} 
              onPersonUpdate={handlePersonUpdate}
            />
            <RelationshipTimeline person={person} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PersonDetail;
