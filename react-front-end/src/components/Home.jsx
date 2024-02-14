import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import MapComponent from '../MapComponent';
import '../styles/Home.scss'; 

const Home = ({ gasStations, setGasStations }) => {
  const [panToUser, setPanToUser] = useState(false);

  const logos = [
    { src: "/Canadian-Tire-Gas-Station.jpg", alt: "Canadian Tire" },
    { src: "/Co-op-Gas-Station.jpg", alt: "Co-op" },
    { src: "/Esso-Gas-Station.jpg", alt: "Esso" },
    { src: "/Husky-Energy-Gas-Station.jpg", alt: "Husky Energy" },
    { src: "/Petro-Canada-Gas-Station.jpg", alt: "Petro-Canada" },
    { src: "/Shell-Gas-Station.jpg", alt: "Shell" },
  ];

  return (
    <div className="home-container">
    <h1>We Help You Find The Best Gas Prices Near You!</h1>
      <MapComponent gasStations={gasStations} setGasStations={setGasStations} panToUser={panToUser} setPanToUser={setPanToUser} />
      <div className="gas-station-info">
        {logos.map((logo, index) => (
          <div key={index} className="logo-container">
            <img src={logo.src} alt={logo.alt} className="logo" />
            <span className="logo-name">{logo.alt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

<Route path="/Home" element={<Home />} />
