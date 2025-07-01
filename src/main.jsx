import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Leaflet CSS
import 'leaflet/dist/leaflet.css';
// Gesture-handling CSS & JS
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css';
import 'leaflet-gesture-handling';

import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App/></React.StrictMode>
);
