// src/components/GasStation.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../actions/favoriteActions";

const GasStation = ({ gasStation, handleDelete }) => {
    const dispatch = useDispatch();
    return (
        <Card style={{ width: "18rem" }}>
        <Card.Body>
            <Card.Title>{gasStation.name}</Card.Title>
            <Card.Text>
            {gasStation.address}
            <br />
            {gasStation.city}, {gasStation.state} {gasStation.zip}
            <br />
            {gasStation.phone}
            </Card.Text>
            <Button
            variant="primary"
            onClick={() => dispatch(addToFavorites(gasStation))}
            >
            Add to Favorites
            </Button>
            <Button
            variant="danger"
            onClick={() => {
                handleDelete(gasStation.gas_station_id);
                dispatch(removeFromFavorites(gasStation.gas_station_id));
            }}
            >
            Remove from Favorites
            </Button>
        </Card.Body>
        </Card>
    );
    }

export default GasStation;

