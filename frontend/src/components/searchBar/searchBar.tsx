import React from 'react';
import { useState, FormEvent, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import './searchBar.css';
import './searchBarAnimation.css';
import { useNavigate } from '@tanstack/react-router';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

function SearchBar({ onSearch = () => {} }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<{ id: number; title: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch suggestions from the database
  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) return [];
    
    setIsLoading(true);
    try {
      // Make an API call to your backend endpoint
      const response = await fetch(`/api/search?query=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Create a debounced version of fetchSuggestions
  const debouncedFetchSuggestions = debounce(async (input: string) => {
    const results = await fetchSuggestions(input);
    setFilteredSuggestions(results);
    setShowSuggestions(true);
  }, 300);

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
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      
      // If we have a matching suggestion, use its ID for navigation
      const matchingSuggestion = filteredSuggestions.find(
        suggestion => suggestion.title.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (matchingSuggestion) {
        navigate({ to: '/$title', params: { title: matchingSuggestion.title } });
      } else {
        navigate({ to: '/$title', params: { title: searchTerm } });
      }
      
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const selected = filteredSuggestions[activeIndex];
      handleSuggestionClick(selected);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: { id: number; title: string }) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setActiveIndex(-1);
    onSearch(suggestion.title);
    navigate({ to: '/$title', params: { title: suggestion.title } });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit} autoComplete="off">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Rechercher un manga ou anime..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="search-input"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="submit" className="search-button">
            Rechercher
          </button>
        </div>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-container" onClick={(e) => e.stopPropagation()}>
            <ul className="suggestions-list">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        {isLoading && (
          <div className="loading-indicator">Chargement...</div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;