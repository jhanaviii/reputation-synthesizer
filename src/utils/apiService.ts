
import { toast } from "@/components/ui/use-toast";
import { Person } from "./mockData";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AIResponse {
  message: string;
  suggestedActions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidenceScore?: number; 
  entities?: Array<{name: string, type: string}>;
  timeEstimate?: string;
}

// Function to call the Python backend API
export const processCommandAPI = async (command: string, person: Person): Promise<AIResponse> => {
  try {
    console.log(`Calling API for command: "${command}" for person: ${person.name}`);
    
    const response = await fetch(`${API_URL}/process-command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command,
        personId: person.id,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('Error calling API:', error);
    
    // If API fails, fall back to the frontend simulation
    console.log('Falling back to frontend simulation');
    
    // Import the frontend simulation function
    const { processCommand } = await import('./aiService');
    
    // Use the frontend simulation instead
    const fallbackResponse = processCommand(command, person);
    
    // Notify user about the fallback
    toast({
      title: "Using simulation mode",
      description: "Could not connect to AI backend. Using simulated responses instead.",
      variant: "destructive",
      duration: 5000,
    });
    
    return fallbackResponse;
  }
};

// Check if the backend API is available
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Add a new task to a person (via API if available)
export const addTaskToPerson = async (
  person: Person,
  taskTitle: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
): Promise<Person> => {
  try {
    // Check if backend is available
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      // Call backend API
      const response = await fetch(`${API_URL}/add-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId: person.id,
          task: {
            title: taskTitle,
            priority,
            dueDate,
            status: 'pending',
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task via API');
      }
      
      const updatedPerson = await response.json();
      
      toast({
        title: "Task added",
        description: `"${taskTitle}" assigned to ${person.name}`,
        duration: 3000,
      });
      
      return updatedPerson;
    } else {
      // Fall back to frontend implementation
      const { addTaskToPerson: localAddTask } = await import('./aiService');
      return localAddTask(person, taskTitle, priority, dueDate);
    }
  } catch (error) {
    console.error('Error adding task:', error);
    
    // Fall back to frontend implementation
    const { addTaskToPerson: localAddTask } = await import('./aiService');
    return localAddTask(person, taskTitle, priority, dueDate);
  }
};

// Complete a task (via API if available)
export const completeTask = async (person: Person, taskId: string): Promise<Person> => {
  try {
    // Check if backend is available
    const isBackendAvailable = await checkBackendAvailability();
    
    if (isBackendAvailable) {
      // Call backend API
      const response = await fetch(`${API_URL}/complete-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId: person.id,
          taskId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete task via API');
      }
      
      const updatedPerson = await response.json();
      
      toast({
        title: "Task completed",
        description: `Task for ${person.name} marked as complete`,
        duration: 3000,
      });
      
      return updatedPerson;
    } else {
      // Fall back to frontend implementation
      const { completeTask: localCompleteTask } = await import('./aiService');
      return localCompleteTask(person, taskId);
    }
  } catch (error) {
    console.error('Error completing task:', error);
    
    // Fall back to frontend implementation
    const { completeTask: localCompleteTask } = await import('./aiService');
    return localCompleteTask(person, taskId);
  }
};
