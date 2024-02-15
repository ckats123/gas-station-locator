import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import ('../styles/Favorites.scss')

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch favorited gas stations using the user's ID from localStorage
    const userId = localStorage.getItem('userId');
    console.log(userId);

    if (userId) {
      axios.get(`/api/favorites/${userId}`)
        .then(response => {
          setFavorites(response.data);
        })
        .catch(error => {
          console.error('Error fetching favorites:', error);
        });
    }
  }, []);

  return (
    <div>
      <h1>Favorited Gas Stations</h1>
      <div className='fav-stations'>

      {favorites.map(gasStation => (
        <div key={gasStation.id} className="gas-station-box">
          <h2>{gasStation.name}</h2>
          <p>Address: {gasStation.vicinity}</p>
          <p>Regular Price: ${gasStation.regular_price}</p>
          <p>Premium Price: ${gasStation.premium_price}</p>
          <p>Diesel Price: ${gasStation.diesel_price}</p>
          <p>Rating: {gasStation.rating}</p>

          {/* Small Leaflet map with the gas station marked */}
          <MapContainer center={[gasStation.lat, gasStation.lng]} zoom={15} style={{ height: '200px', width: '300px' }}>
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={30}
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[gasStation.lat, gasStation.lng]}
            icon={L.icon({
              iconUrl: '/user-marker.png',
              iconSize: [25, 25],
              iconAnchor: [12, 12],
              popupAnchor: [0, -10],
            })}
            >
              <Popup>{gasStation.name}</Popup>
            </Marker>
          </MapContainer>
          <div className="favorite-icon">❤️</div>
        </div>
        
      ))}
    </div>
    </div>
  );
};

export default FavoritesPage;
