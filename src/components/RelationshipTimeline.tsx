
import { Person } from '../utils/mockData';
import { Calendar, DollarSign, MessageCircle, CheckCircle2, ArrowDown } from 'lucide-react';

interface RelationshipTimelineProps {
  person: Person;
}

export const RelationshipTimeline = ({ person }: RelationshipTimelineProps) => {
  // Sort timeline items by date (newest first)
  const sortedTimeline = [...person.timeline].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Get icon for timeline item type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'contact':
        return <MessageCircle className="w-4 h-4" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };
  
  // Get color for timeline item type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'payment':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'contact':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'task':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
    }
  };
  
  return (
    <div className="premium-card">
      <div className="px-6 py-5 border-b border-border/40">
        <h2 className="text-lg font-semibold">Relationship Timeline</h2>
      </div>
      
      <div className="px-6 py-4">
        {sortedTimeline.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No timeline events available</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-2.5 top-1 bottom-0 w-px bg-border/70"></div>
            
            <div className="space-y-6">
              {sortedTimeline.map((item, index) => (
                <div key={item.id} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  {/* Timeline content */}
                  <div className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <div className="text-xs text-muted-foreground">{formatDate(item.date)}</div>
                    </div>
                    <p className="text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {sortedTimeline.length > 5 && (
              <div className="mt-6 text-center">
                <button className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                  <span>Show more</span>
                  <ArrowDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipTimeline;
