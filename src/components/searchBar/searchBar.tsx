import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import './searchBar.css';
import './searchBarAnimation.css';
import data from '../../data/datascenario.json';
import { useNavigate } from '@tanstack/react-router';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void; // Rendu optionnel
}

function SearchBar({ onSearch = () => {} }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);
    if (input.trim()) {
      const matches = data
        .filter((entry) =>
          entry.title.toLowerCase().includes(input.toLowerCase()),
        )
        .map((entry) => entry.title);
      setFilteredSuggestions(matches);
      setShowSuggestions(true);
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
      navigate({ to: '/$title', params: { title: searchTerm } });
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
      );
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const selected = filteredSuggestions[activeIndex];
      handleSuggestionClick(selected);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setActiveIndex(-1);
    onSearch(suggestion);
    navigate({ to: '/$title', params: { title: suggestion } });
  };

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
          />
          <button type="submit" className="search-button">
            Rechercher
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-container">
            <ul className="suggestions-list">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
