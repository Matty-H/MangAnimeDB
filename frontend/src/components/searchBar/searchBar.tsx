import React, { useMemo } from 'react';
import { useState, FormEvent, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import './searchBar.css';
import './searchBarAnimation.css';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

// Interface pour les suggestions de recherche correspondant à notre modèle Prisma
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

  // Fonction pour récupérer les suggestions depuis notre API
  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) return [];
    
    setIsLoading(true);
    try {
      // Appel à notre nouveau endpoint API
      const response = await fetch(`/api/suggestions?query=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      return data as SearchSuggestion[]; // Le format correspond déjà à notre interface
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de debounce pour limiter les appels API
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Version debounce de fetchSuggestions
  const debouncedFetchSuggestions = useMemo(() => 
    debounce(async (input: string) => {
      console.log("debouncedFetchSuggestions called with:", input);
      const results = await fetchSuggestions(input);
      console.log("Fetched suggestions:", results);
      setFilteredSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300), []
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
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      
      // Si on a une suggestion correspondante, utiliser son ID pour la navigation
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

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setActiveIndex(-1);
    onSearch(suggestion.title);
    navigate({ to: '/$title', params: { title: suggestion.title } });
  };

  // Fermer les suggestions en cliquant à l'extérieur
  useEffect(() => {
    const searchContainer = document.querySelector('.search-container');
  
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
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