import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import SearchBox from './components/SearchBox';
import ResultsOverlay from './components/ResultsOverlay';
import SelectedInfo from './components/SelectedInfo';

export default function App() {
  const [suggestions, setSuggestions] = React.useState([]);
  const [results, setResults]         = React.useState([]);
  const [selected, setSelected]       = React.useState(null);

  return (
    <div className="flex flex-col h-screen">
      {/* Search bar responsive et toujours au-dessus */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[10000] w-full px-6 max-w-4xl">
        <SearchBox
          onSuggestions={setSuggestions}
          onSearchResults={setResults}
        />
      </div>

      {/* Carte interactive */}
      <MapContainer
        className="flex-grow w-full"
        center={[45.433, 4.39]}
        zoom={13}
        gestureHandling
        scrollWheelZoom
        dragging
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ResultsOverlay results={results} onSelect={setSelected}/>
      </MapContainer>

      {/* Panneau de détail */}
      {selected && (
        <div className="absolute bottom-0 left-0 w-full md:w-1/2 lg:w-1/3 px-4 pb-4 z-[10000]">
          <SelectedInfo place={selected}/>
        </div>
      )}
    </div>
  );
}
