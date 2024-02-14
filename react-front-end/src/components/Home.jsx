import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import MapComponent from '../MapComponent';

import '../styles/Home.scss'

// Define the Home component
const Home = ({gasStations, setGasStations}) => {

  return (
    <div className='Home'>
      <h1>Welcome to the Home Page</h1>
      <MapComponent gasStations= {gasStations} setGasStations = {setGasStations} />
    </div>
  );
};

// Export the Home component
export default Home;
