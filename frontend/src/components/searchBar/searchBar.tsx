import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Loader2 } from 'lucide-react';
import { searchService } from '../../services';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

interface SearchSuggestion {
  id: string;
  title: string;
}

// Hook personnalisé pour la logique de suggestions
function useSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    // Debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchService.fetchSuggestions(input);
        setSuggestions(data as SearchSuggestion[]);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return { suggestions, isLoading, fetchSuggestions, clearSuggestions };
}

// Hook personnalisé pour la navigation au clavier
function useKeyboardNavigation(suggestions: SearchSuggestion[], onSelect: (suggestion: SearchSuggestion) => void) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          e.preventDefault();
          onSelect(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  }, [suggestions, activeIndex, onSelect]);

  const resetActiveIndex = useCallback(() => setActiveIndex(-1), []);

  return { activeIndex, handleKeyDown, resetActiveIndex };
}

function SearchBar({ onSearch = () => {} }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading, fetchSuggestions, clearSuggestions } = useSuggestions();

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    clearSuggestions();
    onSearch(suggestion.title);
    navigate({ to: '/$title', params: { title: suggestion.title } });
  }, [onSearch, navigate, clearSuggestions]);

  const { activeIndex, handleKeyDown, resetActiveIndex } = useKeyboardNavigation(suggestions, handleSuggestionSelect);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);
    fetchSuggestions(input);
    setShowSuggestions(!!input.trim());
    resetActiveIndex();
  }, [fetchSuggestions, resetActiveIndex]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const matchingSuggestion = suggestions.find(s => 
      s.title.toLowerCase() === searchTerm.toLowerCase()
    );

    onSearch(searchTerm);
    navigate({
      to: '/$title',
      params: { title: matchingSuggestion?.title ?? searchTerm },
    });

    setShowSuggestions(false);
    resetActiveIndex();
  }, [searchTerm, suggestions, onSearch, navigate, resetActiveIndex]);

  // Gestion du clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showSuggestionsDropdown = showSuggestions && suggestions.length > 0;

  return (
    <div ref={containerRef} className="w-full relative">
      <style>{`
        @keyframes slideInItem {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
        <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                className="w-full p-4 pl-10 focus:outline-none"
                type="text"
                placeholder="Rechercher un manga ou anime..."
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={e => e.stopPropagation()}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
              {isLoading && (
                <Loader2 size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin opacity-70" />
              )}
            </div>
            <button type="submit" className="px-6 py-4 bg-primary text-primary-content font-medium">
              Rechercher
            </button>
          </div>
        </div>

        {showSuggestionsDropdown && (
          <div className="absolute z-[9999] w-full mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="card bg-base-100 card-border border-base-300 overflow-hidden shadow-lg">
              <ul className="divide-y divide-base-300 divide-dashed">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`p-3 cursor-pointer hover:bg-base-200 transition-colors duration-150 ${
                      index === activeIndex ? 'bg-base-200' : ''
                    }`}
                    style={{ 
                      animationDelay: `${index * 30}ms`,
                      animation: 'slideInItem 0.3s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Search size={14} className="opacity-60" />
                      <span>{suggestion.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;