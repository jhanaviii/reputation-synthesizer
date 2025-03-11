
import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getAllPeople, Person } from '../utils/mockData';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search, User, Calendar, ArrowRight } from 'lucide-react';
import { useFadeIn } from '../utils/animations';
import { toast } from "@/components/ui/use-toast";

const Explore = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { domRef, isVisible } = useFadeIn();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPeople(getAllPeople());
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handlePersonSelect = (person: Person) => {
    // Redirect to the main page with search pre-filled
    navigate('/');
    
    // Simulate search a bit later
    setTimeout(() => {
      toast({
        title: "Loading profile",
        description: `Now viewing ${person.name}'s profile`,
        duration: 2000,
      });
    }, 500);
  };
  
  return (
    <MainLayout>
      <div 
        ref={domRef}
        className={`container mx-auto px-6 py-10 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              AI-Powered Relationship Insights
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore your network, manage relationships, and leverage AI to gain unique insights about your interactions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border border-border/40 bg-background/80 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="animate-pulse bg-muted/50 h-24"></CardHeader>
                <CardContent className="pt-4">
                  <div className="animate-pulse bg-muted/70 h-6 w-1/2 mb-2 rounded"></div>
                  <div className="animate-pulse bg-muted/70 h-4 w-2/3 rounded"></div>
                </CardContent>
                <CardFooter className="animate-pulse bg-muted/30 h-16"></CardFooter>
              </Card>
            ))
          ) : (
            people.map((person, index) => (
              <Card 
                key={person.id}
                className="border border-border/40 bg-background/80 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${person.relationshipStatus === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30' : ''}
                        ${person.relationshipStatus === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30' : ''}
                        ${person.relationshipStatus === 'Inactive' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30' : ''}
                        ${person.relationshipStatus === 'Close' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/30' : ''}
                      `}
                    >
                      {person.relationshipStatus} Relationship
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">Rep:</span>
                      <span className={`text-xs font-semibold
                        ${person.reputationScore >= 80 ? 'text-green-600 dark:text-green-400' : ''}
                        ${person.reputationScore >= 60 && person.reputationScore < 80 ? 'text-amber-600 dark:text-amber-400' : ''}
                        ${person.reputationScore < 60 ? 'text-red-600 dark:text-red-400' : ''}
                      `}>
                        {person.reputationScore}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <img 
                        src={person.profileImage} 
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      <CardDescription>
                        {person.role} at {person.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2 pb-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      <span>{person.socialMedia.length} social profiles</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Last contact: {new Date(person.lastContactedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="text-xs font-medium mb-1.5">AI Relationship Insight:</div>
                    <p className="text-xs text-muted-foreground italic">
                      "Your communication with {person.name} is most effective when discussing 
                      {person.role.toLowerCase()}-related topics. Consider scheduling a follow-up soon."
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 pb-4">
                  <Button 
                    onClick={() => handlePersonSelect(person)} 
                    variant="default" 
                    className="w-full flex items-center justify-center gap-1 group-hover:bg-primary/90 transition-colors"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    <span>View Profile</span>
                    <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all ml-0 group-hover:ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {!isLoading && (
          <div className="text-center mt-16 opacity-70">
            <p className="text-sm text-muted-foreground">
              Powered by AI technology to help you manage professional relationships more effectively.
              <br />Search for any contact to see their complete profile with AI-generated insights.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Explore;
