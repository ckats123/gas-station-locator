import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import './styles/MapComponent.scss';
import 'leaflet/dist/leaflet.css';

const GasStationMap = ({ panToUser, setPanToUser, gasStations, setGasStations  }) => {
  const [map, setMap] = useState(null);
  //const [gasStations, setGasStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [closestGasStation, setClosestGasStation] = useState(null);
  const [cheapestGasStation, setCheapestGasStation] = useState(null);

  const [selectedMarker, setSelectedMarker] = useState(null);

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
  if (userLocation) {
    // Fetch gas station data from the backend API
    axios.get('/api/gas-stations', { params: { lat: userLocation[0], lng: userLocation[1] } })
      .then(response => setGasStations(response.data))
      .catch(error => console.error('Error fetching gas stations:', error));

    // Send user location to the '/api/user-location' route
    axios.post('/api/user-location', { latitude: userLocation[0], longitude: userLocation[1] })
      .then(response => console.log('User location sent to backend:', response.data))
      .catch(error => console.error('Error sending user location to backend:', error));
  }
}, [userLocation]);

  useEffect(() => {
    // Leaflet map initialization
    if (userLocation) {
      const leafletMap = L.map('map', {
        center: userLocation,
        zoom: 13,
      });

      // Add OpenStreetMap tiles to the map
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 30,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(leafletMap);

      // Set the map state
      setMap(leafletMap);
    }
  }, [userLocation]);

  useEffect(() => {
    // Update map center when userLocation or gasStations change
    if (map && userLocation) {
      map.setView(userLocation, map.getZoom());
      setPanToUser(false);
    }
  }, [map, userLocation, panToUser, gasStations]);

  useEffect(() => {
    // Find the closest and cheapest gas stations
    if (gasStations.length > 0) {
      const closest = gasStations.reduce((prev, curr) => {
        const prevDistance = L.latLng(userLocation).distanceTo(L.latLng([prev.lat, prev.lng]));
        const currDistance = L.latLng(userLocation).distanceTo(L.latLng([curr.lat, curr.lng]));
        return prevDistance < currDistance ? prev : curr;
      });

      const cheapest = gasStations.reduce((prev, curr) => {
        return prev.regular_price < curr.regular_price ? prev : curr;
      });

      setClosestGasStation(closest);
      setCheapestGasStation(cheapest);
    }
  }, [gasStations, userLocation]);

  useEffect(() => {
    // Find the closest and cheapest gas stations
    if (gasStations.length > 0) {
      const closest = gasStations.reduce((prev, curr) => {
        const prevDistance = L.latLng(userLocation).distanceTo(L.latLng([prev.lat, prev.lng]));
        const currDistance = L.latLng(userLocation).distanceTo(L.latLng([curr.lat, curr.lng]));
        return prevDistance < currDistance ? prev : curr;
      });
  
      const cheapest = gasStations.reduce((prev, curr) => {
        return prev.regular_price < curr.regular_price ? prev : curr;
      });
    }
  }, [gasStations, userLocation]);
  

return (
  <div id="map" style={{ height: '750px', width: '750px', position: 'relative' }}>
    {loading && (
      <div className="loading-screen" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <img src="/loading-image.gif" alt="Loading..." />
      </div>
    )}
    {!loading && map && closestGasStation && cheapestGasStation && (
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
        {gasStations.map(station => {

          const iconUrl =
            (selectedMarker === 'closest' && station === closestGasStation) ? '/closest-marker.png' :
            (selectedMarker === 'cheapest' && station === cheapestGasStation) ? '/cheapest-marker.png' :
            '/marker1.png';
          return (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={L.icon({
                iconUrl,
                iconSize: [25, 25],
                iconAnchor: [41, 41],
                popupAnchor: [1, -34],
                shadowSize: [45, 45],
              })}
            >
              <Popup>
                <div>
                  <h2>{station.name}</h2>
                  <p>Address: {station.vicinity}</p>
                  <p>Regular: ${station.regular_price}/L</p>
                  <p>Premium: ${station.premium_price}/L</p>
                  <p>Diesel: ${station.diesel_price}/L</p>
                  <p>Rating: {station.rating}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Marker for user location */}
        {userLocation && (
          <Marker position={userLocation} icon={L.icon({
            iconUrl: '/user-marker.png',
            iconSize: [25, 25],
            iconAnchor: [12, 12],
            popupAnchor: [0, -10],
          })}>
            <Popup>You are here!</Popup>
          </Marker>
        )}

        {/* Marker for the closest gas station */}
        {closestGasStation && (
          <Marker
            position={[closestGasStation.lat, closestGasStation.lng]}
            icon={L.icon({
              iconUrl: '/marker5.png',
              iconSize: [35, 35],
              iconAnchor: [42, 42],
              popupAnchor: [1, -34],
              shadowSize: [60, 60],
            })}
            onClick={() => setSelectedMarker('closest')}
          >
            <Popup>
              <div>
                <h2>{closestGasStation.name}</h2>
                <p>Address: {closestGasStation.vicinity}</p>
                <p>Regular: ${closestGasStation.regular_price}/L</p>
                <p>Premium: ${closestGasStation.premium_price}/L</p>
                <p>Diesel: ${closestGasStation.diesel_price}/L</p>
                <p>Rating: {closestGasStation.rating}</p>
                <p>Closest gas station</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker for the cheapest gas station */}
        {cheapestGasStation && (
          <Marker
            position={[cheapestGasStation.lat, cheapestGasStation.lng]}
            icon={L.icon({
              iconUrl: '/marker4.png',
              iconSize: [35, 35],
              iconAnchor: [42, 42],
              popupAnchor: [1, -34],
              shadowSize: [45, 45],
            })}
            onClick={() => setSelectedMarker('cheapest')}
          >
            <Popup>
              <div>
                <h2>{cheapestGasStation.name}</h2>
                <p>Address: {cheapestGasStation.vicinity}</p>
                <p>Regular: ${cheapestGasStation.regular_price}/L</p>
                <p>Premium: ${cheapestGasStation.premium_price}/L</p>
                <p>Diesel: ${cheapestGasStation.diesel_price}/L</p>
                <p>Rating: {cheapestGasStation.rating}</p>
                <p>Cheapest gas station</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    )}
  </div>
);
};

export default GasStationMap;