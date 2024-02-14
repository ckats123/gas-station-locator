import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import './styles/MapComponent.scss';
import 'leaflet/dist/leaflet.css';

const GasStationMap = ({ gasStations, setGasStations }) => {
  // State variables
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userPath, setUserPath] = useState([]);
  const limeOptions = { color: 'lime' };
  const [loading, setLoading] = useState(true);
  const [closestGasStation, setClosestGasStation] = useState(null);
  const [cheapestGasStation, setCheapestGasStation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Fetch user's geolocation on component mount
  useEffect(() => {
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

  // Fetch gas station data and send user location to backend on userLocation change
  useEffect(() => {
    if (userLocation || selectedPaymentMethod ) {
      const params = {
        lat: userLocation[0],
        lng: userLocation[1],
        paymentMethod: selectedPaymentMethod,
      };
  
      axios
        .get('/api/gas-stations', { params })
        .then(response => setGasStations(response.data))
        
        .catch(error => console.error('Error fetching gas stations:', error));
    }
  }, [userLocation, selectedPaymentMethod]);

  console.log(gasStations);

  // Initialize Leaflet map on userLocation change
  useEffect(() => {
    if (userLocation && !map) {
      // Create Leaflet map instance
      const leafletMap = L.map('map', {
        center: userLocation,
        zoom: 13,
      });

      // Fetch directions and set userPath state
      let gasStn = { longitude: 43.61555, latitude: -79.7591 };
      let tomtomKey = 'wXVBX4FCpA4Bx6avVDjcG2GEZgvAo8SH';
      let apiRouteQuery = `https://api.tomtom.com/routing/1/calculateRoute/${userLocation[0]}%2C${userLocation[1]}%3A${gasStn.longitude}%2C${gasStn.latitude}/json?maxAlternatives=0&routeRepresentation=polyline&computeTravelTimeFor=all&routeType=shortest&traffic=false&travelMode=car&key=${tomtomKey}`;

      async function fetchDirection(query) {
        const response = await fetch(query);
        if (!response.ok) {
          throw new Error(`Response not OK (Status code: ${response.status})`);
        } else {
          let polylineCoord = [];
          response.json().then(function (directionData) {
            let polylinePts = directionData.routes['0'].legs['0'].points;

            for (let i = 0; i < polylinePts.length - 1; i++) {
              let coordinateB = new L.latLng([polylinePts[i + 1].latitude, polylinePts[i + 1].longitude]);
              polylineCoord.push(coordinateB);
            }

            return polylineCoord;
          }).then(() => setUserPath(polylineCoord));
        }
      }

      // Invoke the fetchDirection function
      fetchDirection(apiRouteQuery);

      // Set the map state
      setMap(leafletMap);
    }

    // Clean up the map when the component is unmounted
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [userLocation, map]);

  // Update map center when userLocation or gasStations change
  useEffect(() => {
    if (map && userLocation) {
      map.setView(userLocation, map.getZoom());
    }
  }, [map, userLocation, gasStations]);

  // Find the closest and cheapest gas stations when gasStations change
  useEffect(() => {
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


  // Render the component
  return (
    <div className='Map-container' style={{ display: 'flex' }}>
      {/* Drop-down menus*/}
      
      <div className='dropdown-menus'>
        <div className='empty'>

        </div>
      <div className='dropdown'>
        <select
        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
        value={selectedPaymentMethod}
      >
        <option value="">Select Payment Method</option>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
        <option value="cash">Cash</option>
        <option value="crypto">Crypto</option>
      </select>
      </div>
      <div className='dropdown'>
      <select>
        <option value="">Select Fuel Type</option>
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
      </select>
      </div>
    </div>

    <div className='map' id="map" style={{ height: '750px', width: '750px', position: 'relative' }}>
      {loading && (
        <div className="loading-screen" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <img src="/loading-image.gif" alt="Loading..." />
        </div>
      )}
      {!loading && map && closestGasStation && cheapestGasStation && (
        <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
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
                    <p>Payment Method: {station.payment_method}</p>
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
                  <p>Payment Method: {closestGasStation.payment_method}</p>
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
                  <p>Payment Method: {cheapestGasStation.payment_method}</p>
                  <p>Cheapest gas station</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
      <div className='empty-space'>
          {/* Empty for now */}
        </div>
    </div>
  );
};

export default GasStationMap;