// src/actions/favoriteActions.js

export const addToFavorites = (gasStation) => ({
  type: "ADD_TO_FAVORITES",
  payload: gasStation,
});

export const getFavorites = () => ({
  type: "GET_FAVORITES",
});

export const removeFromFavorites = (gasStationId) => ({
  type: "REMOVE_FROM_FAVORITES",
  payload: gasStationId,
});
