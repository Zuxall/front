import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import SearchBox from './components/SearchBox';
import ResultsOverlay from './components/ResultsOverlay';
import SelectedInfo from './components/SelectedInfo';

/** Recentre la carte dès que center change */
function Recenter({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function App() {
  const [center, setCenter] = React.useState([46.2276, 2.2137]);
  const [restaurants, setRestaurants] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  /** Lorsqu’on sélectionne une ville, on récupère les McDo via Overpass */
  const handleCitySelect = async city => {
    if (!city.bbox || city.bbox.length !== 4) return;
    const [south, north, west, east] = city.bbox.map(Number);

    setCenter([parseFloat(city.lat), parseFloat(city.lng)]);
    setSelected(null);

    const overpassQ = `
      [out:json][timeout:25];
      (
        node["amenity"="fast_food"]["brand"="McDonald's"](${south},${west},${north},${east});
        way["amenity"="fast_food"]["brand"="McDonald's"](${south},${west},${north},${east});
        relation["amenity"="fast_food"]["brand"="McDonald's"](${south},${west},${north},${east});
      );
      out center tags;
    `;
    try {
      const res  = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQ
      });
      const json = await res.json();
      const nodes = json.elements.map(el => {
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        return {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          // on stocke les tags OSM au cas où
          osmTags: el.tags || {}
        };
      });
      setRestaurants(nodes);
    } catch (err) {
      console.error('Overpass API error:', err);
      setRestaurants([]);
    }
  };

  /** Au clic sur un marqueur, on reverse‑geocode pour récupérer display_name */
  const handleMarkerSelect = async place => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1` +
          `&lat=${place.lat}&lon=${place.lng}`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setSelected({
        name: data.name || place.osmTags.name || "McDonald's",
        address: data.display_name
      });
    } catch (e) {
      console.error('Reverse geocode error:', e);
      // fallback minimal
      setSelected({
        name: place.osmTags.name || "McDonald's",
        address: [
          place.osmTags['addr:street'],
          place.osmTags['addr:housenumber'],
          place.osmTags['addr:city']
        ].filter(Boolean).join(', ')
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Barre de recherche */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[10000] w-full px-6 max-w-4xl">
        <SearchBox onCitySelect={handleCitySelect} />
      </div>

      {/* Carte interactive */}
      <MapContainer
        center={center}
        zoom={10}
        className="flex-grow w-full"
        gestureHandling
        scrollWheelZoom
        dragging
      >
        <Recenter center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <ResultsOverlay results={restaurants} onSelect={handleMarkerSelect} />
      </MapContainer>

      {/* Panneau détail McDo sélectionné */}
      {selected && (
        <div className="absolute bottom-0 left-0 w-full md:w-1/2 lg:w-1/3 px-4 pb-4 z-[10000]">
          <SelectedInfo place={selected} />
        </div>
      )}
    </div>
  );
}
