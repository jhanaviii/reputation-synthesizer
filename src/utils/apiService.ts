
import { toast } from "@/components/ui/use-toast";
import { Person } from './mockData';
import { processCommand } from './aiService';

// Backend API URL
const API_URL = 'http://localhost:5000/api';

// Interfaces for API responses
interface AIResponse {
  message: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidenceScore?: number;
  entities?: Array<{name: string, type: string}>;
  timeEstimate?: string;
  suggestedActions?: string[];
}

// Check if the backend is available
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    console.log('Checking backend API availability...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('Backend API is available and healthy');
      return true;
    } else {
      console.log(`Backend API returned an error status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Backend API connection error:', error);
    return false;
  }
};

// Process command with API or fallback to frontend simulation
export const processCommandAPI = async (
  command: string, 
  person: Person
): Promise<AIResponse> => {
  try {
    // Check if backend is available first
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      // Process with backend API
      const response = await fetch(`${API_URL}/process-command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command,
          personId: person.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Return the AI response directly from the API
      return data as AIResponse;
    } else {
      // Fallback to frontend simulation if backend is unavailable
      console.log('Using frontend AI simulation fallback');
      return processCommand(command, person);
    }
  } catch (error) {
    console.error('Error processing command with API:', error);
    
    // Fallback to frontend simulation if there's an error
    console.log('Falling back to frontend AI simulation');
    return processCommand(command, person);
  }
};

// Add task to person via API or fallback
export const addTaskAPI = async (
  person: Person,
  taskTitle: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
): Promise<Person> => {
  try {
    // Check if backend is available first
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      // Add task via API
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personId: person.id,
          title: taskTitle,
          priority: priority,
          dueDate: dueDate,
          status: 'pending'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const updatedPerson = await response.json();
      
      toast({
        title: "Task added",
        description: `"${taskTitle}" assigned to ${person.name}`,
        duration: 3000,
      });
      
      return updatedPerson;
    } else {
      // Fallback to local state update
      console.log('Using frontend task simulation fallback');
      
      const newTask = {
        id: `t${person.tasks.length + 1}`,
        title: taskTitle,
        dueDate: dueDate,
        status: 'pending' as const,
        priority: priority,
      };
      
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
    }
  } catch (error) {
    console.error('Error adding task:', error);
    
    // Fallback to local state update if API fails
    toast({
      title: "Task added (locally)",
      description: `"${taskTitle}" assigned to ${person.name} (offline mode)`,
      duration: 3000,
    });
    
    const newTask = {
      id: `t${person.tasks.length + 1}`,
      title: taskTitle,
      dueDate: dueDate,
      status: 'pending' as const,
      priority: priority,
    };
    
    return {
      ...person,
      tasks: [...person.tasks, newTask]
    };
  }
};

// Complete a task via API or fallback
export const completeTaskAPI = async (person: Person, taskId: string): Promise<Person> => {
  try {
    // Check if backend is available first
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      // Complete task via API
      const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personId: person.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const updatedPerson = await response.json();
      
      toast({
        title: "Task completed",
        description: `Task for ${person.name} marked as complete`,
        duration: 3000,
      });
      
      return updatedPerson;
    } else {
      // Fallback to local state update
      console.log('Using frontend task completion simulation');
      
      const updatedTasks = person.tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' as const } 
          : task
      );
      
      toast({
        title: "Task completed",
        description: `Task for ${person.name} marked as complete`,
        duration: 3000,
      });
      
      // Return updated person
      return {
        ...person,
        tasks: updatedTasks
      };
    }
  } catch (error) {
    console.error('Error completing task:', error);
    
    // Fallback to local state update if API fails
    toast({
      title: "Task completed (locally)",
      description: `Task for ${person.name} marked as complete (offline mode)`,
      duration: 3000,
    });
    
    const updatedTasks = person.tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const } 
        : task
    );
    
    return {
      ...person,
      tasks: updatedTasks
    };
  }
};

// Schedule a meeting via API or fallback
export const scheduleMeetingAPI = async (
  person: Person,
  meetingTitle: string,
  meetingDate: string,
  meetingSummary: string = ""
): Promise<Person> => {
  try {
    // Check if backend is available first
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      // Schedule meeting via API
      const response = await fetch(`${API_URL}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personId: person.id,
          title: meetingTitle,
          date: meetingDate,
          summary: meetingSummary,
          sentiment: 'neutral'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const updatedPerson = await response.json();
      
      toast({
        title: "Meeting scheduled",
        description: `"${meetingTitle}" with ${person.name} on ${meetingDate}`,
        duration: 3000,
      });
      
      return updatedPerson;
    } else {
      // Fallback to local state update
      console.log('Using frontend meeting simulation fallback');
      
      const newMeeting = {
        id: `m${person.meetings.length + 1}`,
        title: meetingTitle,
        date: meetingDate,
        summary: meetingSummary,
        sentiment: 'neutral' as const
      };
      
      const newTimelineItem = {
        id: `tl_m${person.meetings.length + 1}`,
        date: meetingDate,
        type: 'meeting' as const,
        title: meetingTitle,
        description: `Meeting: ${meetingTitle}`
      };
      
      toast({
        title: "Meeting scheduled",
        description: `"${meetingTitle}" with ${person.name} on ${meetingDate}`,
        duration: 3000,
      });
      
      return {
        ...person,
        meetings: [...person.meetings, newMeeting],
        timeline: [newTimelineItem, ...person.timeline]
      };
    }
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    
    // Fallback to local state update if API fails
    toast({
      title: "Meeting scheduled (locally)",
      description: `"${meetingTitle}" with ${person.name} on ${meetingDate} (offline mode)`,
      duration: 3000,
    });
    
    const newMeeting = {
      id: `m${person.meetings.length + 1}`,
      title: meetingTitle,
      date: meetingDate,
      summary: meetingSummary,
      sentiment: 'neutral' as const
    };
    
    const newTimelineItem = {
      id: `tl_m${person.meetings.length + 1}`,
      date: meetingDate,
      type: 'meeting' as const,
      title: meetingTitle,
      description: `Meeting: ${meetingTitle}`
    };
    
    return {
      ...person,
      meetings: [...person.meetings, newMeeting],
      timeline: [newTimelineItem, ...person.timeline]
    };
  }
};
