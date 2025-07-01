import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';

export default function SearchBox({ onSuggestions, onSearchResults }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setLocalSuggestions] = useState([]);

  useEffect(() => {
    if (!query) { setOpen(false); return; }
    const timer = setTimeout(async () => {
      let mcd = [];
      try {
        const r = await fetch(`/api/mcdonalds?query=${encodeURIComponent(query)}`);
        mcd = r.ok ? await r.json() : [];
      } catch (e) { console.error(e); }

      let nom = [];
      try {
        const r = await fetch(
          `/nominatim/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(query)}`
        );
        const data = r.ok ? await r.json() : [];
        nom = data.map(item => ({
          name: item.display_name,
          address: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
      } catch (e) { console.error(e); }

      const all = [...mcd, ...nom];
      setLocalSuggestions(all);
      onSuggestions(all);
      setOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSuggestions]);

  function handleSelect(place) {
    setQuery(place.name);
    setOpen(false);
    onSearchResults([place]);
  }

  return (
    <div className="relative">
      <Input
        value={query}
        placeholder="Rechercher un restaurant"
        onChange={e=>setQuery(e.target.value)}
        onFocus={()=>query&&setOpen(true)}
      />
      <Button onClick={()=>onSearchResults(suggestions)}>🔍</Button>
      {open && suggestions.length>0 && (
        <Card className="absolute mt-1 w-full max-h-60 overflow-auto z-20">
          {suggestions.map((s,i)=>(
            <div
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={()=>handleSelect(s)}
            >
              {s.name}, {s.address}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
