
import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic, ChevronUp, X, Sparkles } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { processCommand } from '../utils/aiService';
import { Person } from '../utils/mockData';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  person: Person;
  placeholder?: string;
  autoFocus?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const CommandInput = ({
  onSubmit,
  person,
  placeholder = "Ask anything about this relationship...",
  autoFocus = false,
  isExpanded = true,
  onToggleExpand
}: CommandInputProps) => {
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestedCommands, setSuggestedCommands] = useState<string[]>([
    "Summarize my last meeting",
    "Assign a new task",
    "Remind me to follow up next week",
    "Check if any payments are due",
    "Track progress on current projects"
  ]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [command]);
  
  // Auto-focus input
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setIsThinking(true);
      
      // Simulate AI processing time (in a real app, this would be an actual API call)
      setTimeout(() => {
        setIsThinking(false);
        
        // Process the command with our AI service
        const aiResponse = processCommand(command, person);
        
        // Update suggested commands based on AI response
        if (aiResponse.suggestedActions) {
          setSuggestedCommands(aiResponse.suggestedActions);
        }
        
        toast({
          title: "AI Assistant",
          description: aiResponse.message,
          duration: 10000,
        });
      }, 1200);
      
      setCommand("");
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className={`w-full transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
      <div className="premium-card">
        {onToggleExpand && (
          <div className="absolute top-0 right-0 transform -translate-y-1/2 px-1 py-1 rounded-full bg-background shadow">
            <button 
              onClick={onToggleExpand}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronUp className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
        )}
        
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedCommands.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className={`flex rounded-lg transition-all duration-200 ${
            isFocused ? 'ring-2 ring-primary/20' : ''
          }`}>
            <textarea
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isThinking ? "Thinking..." : placeholder}
              rows={1}
              disabled={isThinking}
              className="flex-grow resize-none px-4 py-3 outline-none bg-transparent text-sm placeholder:text-muted-foreground/70 pr-16 disabled:opacity-70"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button
                type="submit"
                className={`p-2 rounded-full transition-colors ${
                  command.trim() && !isThinking
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'text-muted-foreground hover:bg-secondary'
                } ${isThinking ? 'animate-pulse' : ''}`}
                disabled={!command.trim() || isThinking}
                aria-label="Send command"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommandInput;
