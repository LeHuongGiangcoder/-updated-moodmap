'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

interface Suggestion {
  id: string;
  place_name: string;
  text: string;
}

const CityAutocomplete = ({ value, onChange, className, placeholder = 'Search for a city...', autoFocus = false }: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce logic
  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Only search if the user is typing, not when they selected a suggestion
    // We can't easily detect "typing" vs "selecting" with just value prop,
    // so we'll just rely on the user closing the dropdown on selection.
    // However, if the value matches exactly one of the suggestions, we might not want to show it?
    // For now, let's just search.

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) return;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${token}&types=place&limit=5`
        );
        const data = await response.json();
        
        if (data.features) {
          setSuggestions(data.features);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.text); // Or place_name if we want full address
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          className={className}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition-colors"
            >
              <MapPin className="w-3 h-3 text-[var(--primary-green)] flex-shrink-0" />
              <span className="truncate">{suggestion.place_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;