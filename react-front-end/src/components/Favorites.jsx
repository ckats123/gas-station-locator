// src/components/Favorites.jsx
// list of all gas stations that the user has favorited

import React, { useState, useEffect } from "react";
import GasStation from "./GasStation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    
    // useEffect(() => {
    //     const getFavorites = async () => {
    //     try {
    //         const res = await axios.get("/favorites", {
    //         headers: { token: localStorage.token },
    //         });
    //         console.log("Hello", res.data);
    //         setFavorites(res.data);
    //     } catch (err) {
    //         console.error(err.message);
    //     }
    //     };
    //     getFavorites();
    // }, []);
    
    const handleDelete = async (id) => {
        try {
        await axios.delete(`/favorites/${id}`, {
            headers: { token: localStorage.token },
        });
        setFavorites(favorites.filter((favorite) => favorite.gas_station_id !== id));
        } catch (err) {
        console.error(err.message);
        }
    };
    
    return (
        <div>
        <h1>Favorites</h1>
        <div>
            {favorites.map((favorite) => (
            <GasStation
                key={favorite.gas_station_id}
                gasStation={favorite}
                handleDelete={handleDelete}
            />
            ))}
        </div>
        </div>
    );
    }

export default Favorites;
