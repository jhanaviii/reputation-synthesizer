
import { useState } from 'react';
import { Person } from '../utils/mockData';
import { Plus, Calendar, Clock, CheckSquare, Square, ArrowUpRight, ArrowRight } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { addTaskToPerson, completeTask } from '../utils/aiService';

interface TaskManagerProps {
  person: Person;
  onPersonUpdate?: (updatedPerson: Person) => void;
}

export const TaskManager = ({ person, onPersonUpdate }: TaskManagerProps) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get priority styling
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30';
      case 'low':
        return 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30';
      default:
        return 'text-muted-foreground border-muted';
    }
  };
  
  // Get status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  
  // Calculate completion percentage
  const completedTasks = person.tasks.filter(task => task.status === 'completed').length;
  const completionPercentage = person.tasks.length > 0 
    ? Math.round((completedTasks / person.tasks.length) * 100) 
    : 0;
  
  // Group tasks by status
  const pendingTasks = person.tasks.filter(task => 
    task.status === 'pending' || task.status === 'in-progress' || task.status === 'overdue'
  );
  const completedTasksList = person.tasks.filter(task => task.status === 'completed');
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const dueDate = newTaskDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Use our AI service to add the task
    const updatedPerson = addTaskToPerson(person, newTaskTitle, newTaskPriority, dueDate);
    
    // If a callback was provided, update the person in the parent component
    if (onPersonUpdate) {
      onPersonUpdate(updatedPerson);
    }
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
    setShowAddTask(false);
  };
  
  const handleCompleteTask = (taskId: string) => {
    // Use our AI service to complete the task
    const updatedPerson = completeTask(person, taskId);
    
    // If a callback was provided, update the person in the parent component
    if (onPersonUpdate) {
      onPersonUpdate(updatedPerson);
    }
  };
  
  return (
    <div className="premium-card overflow-hidden">
      <div className="px-6 py-5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks & Progress</h2>
          <button 
            onClick={() => setShowAddTask(!showAddTask)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {showAddTask && (
        <div className="px-6 py-4 bg-secondary/30 animate-slide-up">
          <form onSubmit={handleAddTask} className="space-y-3">
            <div>
              <label htmlFor="taskTitle" className="block text-sm font-medium mb-1">
                Task Title
              </label>
              <input
                id="taskTitle"
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="What needs to be done?"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="taskDueDate" className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  id="taskDueDate"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="taskPriority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  id="taskPriority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Overall Progress</div>
          <div className="text-sm font-medium">{completionPercentage}%</div>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex text-sm mt-1 text-muted-foreground justify-between">
          <div>{completedTasks} of {person.tasks.length} tasks completed</div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium mb-3">Active Tasks</h3>
        
        {pendingTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
              <CheckSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No active tasks</p>
            <button 
              onClick={() => setShowAddTask(true)}
              className="mt-2 text-primary text-sm hover:underline"
            >
              Create a new task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-start gap-3">
                  <button 
                    className="mt-0.5 flex-shrink-0"
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    <Square className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-grow">
                    <div className="font-medium text-sm">{task.title}</div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyles(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      <div className={`flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityStyles(task.priority)}`}>
                        {task.priority} priority
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {completedTasksList.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Completed Tasks</h3>
              <button className="text-xs text-primary flex items-center hover:underline">
                <span>View all</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            
            <div className="space-y-3">
              {completedTasksList.slice(0, 2).map((task) => (
                <div key={task.id} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="font-medium text-sm line-through opacity-70">{task.title}</div>
                      
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>Completed on {formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
