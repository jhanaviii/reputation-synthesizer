
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
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
    <div className={`w-full max-w-xl mx-auto ${className}`}>
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
            onFocus={() => setIsFocused(true)}
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
    </div>
  );
};

export default SearchBar;
