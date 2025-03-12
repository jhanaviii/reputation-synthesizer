
import { useState, useRef, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import { getAllPeople, Person } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for a person...", 
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Load all people as initial suggestions
  useEffect(() => {
    setSuggestions(getAllPeople().slice(0, 5)); // Show top 5 initially
  }, []);
  
  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions(getAllPeople().slice(0, 5)); // Show top 5 when empty
    } else {
      const filtered = getAllPeople().filter(person => 
        person.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 7)); // Show up to 7 matches when typing
    }
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    setSuggestions(getAllPeople().slice(0, 5));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleSuggestionClick = (personName: string) => {
    setQuery(personName);
    onSearch(personName);
    setShowSuggestions(false);
  };
  
  // Handle clicks outside of suggestions to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);
  
  // Add keydown listener for Cmd+K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  return (
    <div className={`w-full max-w-xl mx-auto ${className} relative`}>
      <form 
        onSubmit={handleSearch}
        className={`relative group transition-all duration-300 ${
          isFocused 
            ? 'shadow-lg ring-2 ring-primary/20' 
            : 'shadow hover:shadow-md'
        }`}
      >
        <div className="flex items-center overflow-hidden rounded-full bg-background border border-border">
          <div className="flex-shrink-0 pl-4">
            <Search size={18} className="text-muted-foreground" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="w-full py-3 px-3 text-sm outline-none bg-transparent placeholder:text-muted-foreground/70"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="flex-shrink-0 mr-1 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
          
          <button
            type="submit"
            className="flex-shrink-0 h-full px-5 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </div>
        
        <div className="hidden md:flex absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="px-1.5 py-0.5 rounded border border-muted-foreground/20 text-xs text-muted-foreground/70">
            ⌘K
          </div>
        </div>
      </form>
      
      {/* User suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 mt-2 w-full bg-background rounded-lg shadow-lg border border-border overflow-hidden"
        >
          <div className="p-2 text-xs text-muted-foreground font-medium">
            {query.trim() === '' ? 'Suggested Users' : 'Search Results'}
          </div>
          
          <div className="max-h-[350px] overflow-y-auto">
            {suggestions.map((person) => (
              <div 
                key={person.id}
                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(person.name)}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-muted">
                  {person.profileImage ? (
                    <img 
                      src={person.profileImage} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <User size={16} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{person.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {person.role} at {person.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
