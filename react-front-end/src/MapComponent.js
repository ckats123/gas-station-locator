import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import './styles/MapComponent.scss';
import 'leaflet/dist/leaflet.css';

const GasStationMap = ({ panToUser, setPanToUser }) => {
  const [gasStations, setGasStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLoading(false);
        },
        error => {
          console.error('Error getting geolocation:', error);
          setLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Fetch gas station data from the backend API
    if (userLocation) {
      axios.get('/api/gas-stations', { params: { lat: userLocation[0], lng: userLocation[1] } })
      .then(response => setGasStations(response.data))
        .catch(error => console.error('Error fetching gas stations:', error));

      // Send user location to the '/api/user-location' route
      axios.post('/api/user-location', { latitude: userLocation[0], longitude: userLocation[1] })
        .then(response => console.log('User location sent to backend:', response.data))
        .catch(error => console.error('Error sending user location to backend:', error));
    }
  }, [userLocation]);

  return (
    <div id="map" style={{ height: '750px', width: '750px', position: 'relative' }}>
      {loading && (
        <div className="loading-screen" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <img src="/loading-image.gif" alt="Loading..." />
        </div>
        )}
      {!loading && (
        <MapContainer
          center={userLocation || [48.407326, -123.329773]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={30}
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Render markers based on gas station data */}
          {gasStations.map(station => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={L.icon({
                iconUrl: '/marker1.png',
                iconSize: [25, 25],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <div>
                  <h2>{station.name}</h2>
                  <p>Regular: ${station.regular_price}/L</p>
                  <p>Premium: ${station.premium_price}/L</p>
                  <p>Diesel: ${station.diesel_price}/L</p>
                  <p>Rating: {station.rating}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Marker for user location */}
          {userLocation && (
            <Marker position={userLocation} icon={L.icon({
              iconUrl: '/user-marker.png', 
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -10],
            })}>
              <Popup>You are here!</Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default GasStationMap;
