
import { useState } from 'react';
import { ExternalLink, Mail, Phone, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { Person } from '../utils/mockData';
import { useImageLoad } from '../utils/animations';

interface ProfileCardProps {
  person: Person;
}

export const ProfileCard = ({ person }: ProfileCardProps) => {
  const imageProps = useImageLoad();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date as "Month Day, Year"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const getRelationshipStatusClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Inactive':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Close':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="premium-card overflow-hidden transition-all duration-300">
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden bg-muted">
            <img
              src={person.profileImage}
              alt={person.name}
              className={`w-full h-full object-cover ${imageProps.className}`}
              onLoad={imageProps.onLoad}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-12 px-6 pb-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">{person.name}</h2>
          <p className="text-sm text-muted-foreground">{person.role} at {person.company}</p>
          
          <div className="mt-3 flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipStatusClass(person.relationshipStatus)}`}>
              {person.relationshipStatus} Relationship
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 text-muted-foreground mr-2" />
              <a href={`mailto:${person.email}`} className="text-primary hover:underline">{person.email}</a>
            </div>
            
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 text-muted-foreground mr-2" />
              <a href={`tel:${person.phone}`} className="hover:text-primary">{person.phone}</a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
              <span>Last meeting: {person.meetings.length > 0 ? formatDate(person.meetings[0].date) : 'None'}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-muted-foreground mr-2" />
              <span>Last contacted: {formatDate(person.lastContactedDate)}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Reputation Score</div>
              <div className="text-sm font-medium">{person.reputationScore}/100</div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${person.reputationScore}%` }}
              ></div>
            </div>
          </div>
          
          {isExpanded && (
            <div className="pt-4 space-y-4 animate-scale-in">
              <div>
                <h3 className="text-sm font-medium mb-2">Social Media</h3>
                <div className="flex flex-wrap gap-2">
                  {person.socialMedia.map((social) => (
                    <a 
                      key={social.platform} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      {social.platform}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
              
              {person.meetings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Meetings</h3>
                  <div className="space-y-2">
                    {person.meetings.slice(0, 2).map((meeting) => (
                      <div key={meeting.id} className="p-3 rounded-lg bg-secondary/50">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">{meeting.title}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(meeting.date)}</div>
                        </div>
                        <p className="text-xs mt-1 line-clamp-2">{meeting.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {person.tasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Active Tasks</h3>
                  <div className="space-y-2">
                    {person.tasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="p-3 rounded-lg bg-secondary/50">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className={`text-xs px-1.5 py-0.5 rounded ${
                            task.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : task.status === 'overdue' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {task.status}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-muted-foreground">Due: {formatDate(task.dueDate)}</div>
                          <div className={`text-xs ${
                            task.priority === 'high' 
                              ? 'text-red-600 dark:text-red-400' 
                              : task.priority === 'medium' 
                                ? 'text-amber-600 dark:text-amber-400' 
                                : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {task.priority} priority
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
            <ArrowUpRight className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
