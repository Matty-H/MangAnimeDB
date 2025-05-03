import React, { useMemo, useState, FormEvent, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

interface SearchSuggestion {
  id: string;
  title: string;
}

function SearchBar({ onSearch = () => {} }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) return [];

    setIsLoading(true);
    try {
      const response = await fetch(`/api/suggestions?query=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      return data as SearchSuggestion[];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (input: string) => {
        const results = await fetchSuggestions(input);
        setFilteredSuggestions(results);
        setShowSuggestions(results.length > 0);
      }, 300),
    []
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input.trim()) {
      debouncedFetchSuggestions(input);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveIndex(-1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    onSearch(searchTerm);

    const matchingSuggestion = filteredSuggestions.find(
      (suggestion) => suggestion.title.toLowerCase() === searchTerm.toLowerCase()
    );

    navigate({
      to: '/$title',
      params: { title: matchingSuggestion?.title ?? searchTerm },
    });

    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setActiveIndex(-1);
    onSearch(suggestion.title);
    navigate({ to: '/$title', params: { title: suggestion.title } });
  };

  useEffect(() => {
    const searchContainer = document.querySelector('.search-container');
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container w-full relative">
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
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50">
                <Search size={18} />
              </div>
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 size={18} className="animate-spin opacity-70" />
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="px-6 py-4 bg-primary text-primary-content font-medium"
            >
              Rechercher
            </button>
          </div>
        </div>
      
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1">
            <div className="card bg-base-100 card-border border-base-300 overflow-hidden shadow-lg">
              <ul className="divide-y divide-base-300 divide-dashed">
                {filteredSuggestions.map((suggestion, index) => (
                  <li 
                    key={suggestion.id} 
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`p-3 cursor-pointer hover:bg-base-200 ${
                      index === activeIndex ? 'bg-base-200' : ''
                    }`}
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