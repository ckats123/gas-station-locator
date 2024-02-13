// src/components/GasStationList.jsx
// list of all gas stations nearby

import React, { useState, useEffect } from "react";
import GasStation from "./GasStation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GasStationList = () => {
  const [gasStations, setGasStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getGasStations = async () => {
      try {
        const res = await axios.get("/gas_stations", {
          headers: { token: localStorage.token },
        });
        setGasStations(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    getGasStations();
  }, []);

  return (
    <div>
      <h1>Gas Stations</h1>
      <div>
        {gasStations.map((gasStation) => (
          <GasStation
            key={gasStation.gas_station_id}
            gasStation={gasStation}
          />
        ))}
      </div>
    </div>
  );
};

export default GasStationList;
