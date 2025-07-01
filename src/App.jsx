import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import SearchBox from './components/SearchBox';
import ResultsOverlay from './components/ResultsOverlay';
import SelectedInfo from './components/SelectedInfo';

/** Recentre la carte à chaque changement de center */
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

  /** Appelé par SearchBox */
  const handleCitySelect = async city => {
    console.log('App.handleCitySelect ←', city);
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
        body: overpassQ,
      });
      const json = await res.json();
      const nodes = json.elements.map(el => {
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        return {
          name: el.tags?.name || "McDonald's",
          address: [
            el.tags?.['addr:street'],
            el.tags?.['addr:housenumber'],
            el.tags?.['addr:city']
          ].filter(Boolean).join(', '),
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        };
      });
      console.log('McDo récupérés →', nodes);
      setRestaurants(nodes);
    } catch (err) {
      console.error('Overpass API error:', err);
      setRestaurants([]);
    }
  };

  /** Appelé par ResultsOverlay */
  const handleMarkerSelect = place => {
    console.log('App.handleMarkerSelect ←', place);
    setSelected(place);
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
        <ResultsOverlay
          results={restaurants}
          onSelect={handleMarkerSelect}
        />
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
