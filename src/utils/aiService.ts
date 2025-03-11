
import { toast } from "@/components/ui/use-toast";
import { Person } from "./mockData";

interface AIResponse {
  message: string;
  suggestedActions?: string[];
}

// Simulated AI processing for natural language commands
export const processCommand = (command: string, person: Person): AIResponse => {
  // Convert command to lowercase for easier matching
  const commandLower = command.toLowerCase();
  
  // Meeting summary related commands
  if (commandLower.includes('summarize') && commandLower.includes('meeting')) {
    const meetingIndex = person.meetings.length > 0 ? 0 : -1;
    
    if (meetingIndex >= 0) {
      const meeting = person.meetings[meetingIndex];
      return {
        message: `Summary of your meeting "${meeting.title}" with ${person.name}:\n\n${meeting.summary}\n\nOverall sentiment: ${meeting.sentiment}`,
        suggestedActions: [
          `Set a follow-up meeting with ${person.name}`,
          `Assign a task based on this meeting`,
          `Share this summary with team`
        ]
      };
    } else {
      return {
        message: `I couldn't find any recorded meetings with ${person.name}. Would you like to schedule one?`,
        suggestedActions: [
          `Schedule a meeting with ${person.name}`,
          `Take notes for a past meeting`
        ]
      };
    }
  }
  
  // Task related commands
  else if ((commandLower.includes('assign') || commandLower.includes('create') || commandLower.includes('add')) && 
           (commandLower.includes('task') || commandLower.includes('work'))) {
    // Extract task details from command
    let taskTitle = command;
    let priority = "medium";
    
    if (commandLower.includes('high priority')) {
      priority = "high";
    } else if (commandLower.includes('low priority')) {
      priority = "low";
    }
    
    // Create a task description from the command
    if (commandLower.includes('to')) {
      const parts = command.split(/\s+to\s+/i);
      if (parts.length > 1) {
        taskTitle = parts[1].trim();
        if (taskTitle.endsWith('.')) {
          taskTitle = taskTitle.slice(0, -1);
        }
      }
    }
    
    return {
      message: `I've created a new ${priority} priority task for ${person.name}: "${taskTitle}". You can set a deadline and track progress in the tasks section.`,
      suggestedActions: [
        `Set deadline for this task`,
        `Add more details to the task`,
        `Notify ${person.name} about this task`
      ]
    };
  }
  
  // Follow-up reminders
  else if (commandLower.includes('remind') || commandLower.includes('follow up')) {
    return {
      message: `I've set a reminder to follow up with ${person.name}. Would you like to specify a date or topic for this follow-up?`,
      suggestedActions: [
        `Follow up next week`,
        `Follow up about project status`,
        `Send a check-in email`
      ]
    };
  }
  
  // Relationship advice
  else if (commandLower.includes('relationship') || commandLower.includes('connection')) {
    let advice = '';
    
    switch (person.relationshipStatus) {
      case 'New':
        advice = `Since your relationship with ${person.name} is new, consider scheduling an introductory meeting to establish rapport. Ask about their professional background and goals.`;
        break;
      case 'Active':
        advice = `You have an active relationship with ${person.name}. To strengthen it, consider sharing relevant industry insights or scheduling a casual check-in meeting.`;
        break;
      case 'Inactive':
        advice = `Your relationship with ${person.name} has been inactive lately. Consider rekindling the connection with a friendly message or invitation to a professional event.`;
        break;
      case 'Close':
        advice = `You have a close relationship with ${person.name}. Maintain this by offering support for their initiatives and considering them for collaborative opportunities.`;
        break;
      default:
        advice = `To build a stronger relationship with ${person.name}, maintain regular contact and find ways to provide value to their professional endeavors.`;
    }
    
    return {
      message: advice,
      suggestedActions: [
        `Schedule a meeting`,
        `Share an article/resource`,
        `Introduce to a contact`
      ]
    };
  }
  
  // Payment or financial reminders
  else if (commandLower.includes('payment') || commandLower.includes('money') || commandLower.includes('owe') || 
           commandLower.includes('pay') || commandLower.includes('financial')) {
    return {
      message: `I've noted your financial request regarding ${person.name}. Would you like to record a specific payment or transaction?`,
      suggestedActions: [
        `Record a payment to ${person.name}`,
        `Note that ${person.name} owes money`,
        `Set payment reminder`
      ]
    };
  }
  
  // When AI doesn't understand
  else {
    return {
      message: `I'm not sure how to process your request about ${person.name}. Try asking me to summarize meetings, assign tasks, set reminders, offer relationship advice, or manage financial notes.`,
      suggestedActions: [
        `Summarize last meeting`,
        `Assign a new task`,
        `Set a reminder`
      ]
    };
  }
};

// Add a new task to a person's tasks (in a real app, this would update the database)
export const addTaskToPerson = (
  person: Person,
  taskTitle: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
): Person => {
  const newTask = {
    id: `t${person.tasks.length + 1}`,
    title: taskTitle,
    dueDate: dueDate,
    status: 'pending' as const,
    priority: priority,
  };
  
  // In a real app, this would make an API call to update the database
  // For this demo, we'll show a toast notification
  toast({
    title: "Task added",
    description: `"${taskTitle}" assigned to ${person.name}`,
    duration: 3000,
  });
  
  // Return updated person (in a real app, this would come from the server)
  return {
    ...person,
    tasks: [...person.tasks, newTask]
  };
};

// Complete a task (in a real app, this would update the database)
export const completeTask = (person: Person, taskId: string): Person => {
  const updatedTasks = person.tasks.map(task => 
    task.id === taskId 
      ? { ...task, status: 'completed' as const } 
      : task
  );
  
  // In a real app, this would make an API call to update the database
  toast({
    title: "Task completed",
    description: `Task for ${person.name} marked as complete`,
    duration: 3000,
  });
  
  // Return updated person (in a real app, this would come from the server)
  return {
    ...person,
    tasks: updatedTasks
  };
};

// Generate an AI-powered relationship insight
export const generateRelationshipInsight = (person: Person): string => {
  const insights = [
    `Based on your communication patterns, your relationship with ${person.name} is strongest when discussing ${person.role.toLowerCase()}-related topics.`,
    `You typically connect with ${person.name} every 2-3 weeks. Consider scheduling your next check-in soon.`,
    `${person.name}'s response time to your messages averages 8 hours. This suggests a high level of engagement.`,
    `You've had ${person.meetings.length} meetings with ${person.name} this quarter, which is above average for your network.`,
    `${person.name}'s online reputation score of ${person.reputationScore} indicates they are well-regarded in their field.`,
    `Your conversations with ${person.name} tend to be more ${person.meetings[0]?.sentiment || 'neutral'} than average.`,
    `Consider deepening your professional relationship with ${person.name} by introducing them to relevant contacts in your network.`,
    `${person.name} from ${person.company} has expertise that complements your recent projects.`
  ];
  
  // Return a random insight (in a real app, this would use more sophisticated logic)
  return insights[Math.floor(Math.random() * insights.length)];
};
