import React from 'react';
import { Marker, Popup } from 'react-leaflet';

export default function ResultsOverlay({ results, onSelect }) {
  return (
    <>
      {results.map((place,i)=>(
        <Marker
          key={i}
          position={[place.lat, place.lng]}
          eventHandlers={{ click: ()=>onSelect(place) }}
        >
          <Popup>
            <div className="p-2">
              <strong>{place.name}</strong><br/>
              {place.address}<br/>
              <button
                className="mt-2 px-2 py-1 bg-yellow-400 rounded"
                onClick={()=>onSelect(place)}
              >choisir</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
