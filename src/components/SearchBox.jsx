import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';

export default function SearchBox({ onCitySelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query) {
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('format', 'json');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('limit', '5');
        url.searchParams.set('countrycodes', 'fr');
        url.searchParams.set('q', query);

        const res = await fetch(url.toString(), {
          headers: { 'Accept-Language': 'fr' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setSuggestions(
          data.map(item => ({
            name: item.display_name,
            lat: item.lat,
            lng: item.lon,
            bbox: item.boundingbox  // [south, north, west, east]
          }))
        );
        setOpen(true);
      } catch (e) {
        console.error('Recherche Nominatim erreur :', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = city => {
    setQuery(city.name);
    setOpen(false);
    if (typeof onCitySelect === 'function') {
      onCitySelect(city);
    } else {
      console.error('SearchBox: onCitySelect n’est pas une fonction', onCitySelect);
    }
  };

  return (
    <div className="relative">
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher une ville (France)"
          className="flex-grow px-4 py-3 text-base placeholder-gray-500 focus:outline-none"
        />
        <Button
          onClick={() => handleSelect({ name: query, lat: null, lng: null, bbox: [] })}
          className="px-4 bg-yellow-400 hover:bg-yellow-500"
        >
          🔍
        </Button>
      </div>

      {open && suggestions.length > 0 && (
        <Card className="absolute mt-1 w-full bg-white rounded-b-lg shadow-lg z-20">
          {suggestions.map((city, i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(city)}
            >
              {city.name}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
