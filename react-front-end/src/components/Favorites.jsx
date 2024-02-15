import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import '../styles/Favorites.scss'; // Import CSS file for styling

// list item with the gas station name and price
function FavoriteItem({ station, price }) {
  return (
    <li className="favorite-item">
      <span className="station-name">{station}</span>
      <span className="station-price">${price}</span>
    </li>
  );
}

//  the list of  gas stations
// function FavoriteList({ favorites }) {
//   return (
//     <ul className="favorite-list">
//       {favorites.map((fav) => (
//         <FavoriteItem
//           key={fav.station}
//           station={fav.station}
//           price={fav.price}
//         />
//       ))}
//     </ul>
//   );
// }

function Card({ station, price }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{station}</h3>
      </div>
      <div className="card-body">
        <p className="card-text">${price}</p>
      </div>
    </div>
  );
}

function FavoriteList({ favorites }) {
  return (
    <div className="card-list">
      {favorites.map((fav) => (
        <Card key={fav.station} station={fav.station} loc={fav.loc} price={fav.price} />
      ))}
    </div>
  );
}

// 
function Favorites() {
  // A state variable that stores the array of favorite gas stations and prices
  const [favorites, setFavorites] = React.useState([
    { station: "Husky @ 200 King St., Victoria", price: 1.49 },
    { station: "Petro-Canada @ 12 Centre Dr., Victoria", price: 1.51 },
    { station: "Costco @ 20 Heather Way, Victoria", price: 1.35 },
  ]);

  return (
    <div className="favorites">
      <h2>Current pricing at my favorite gas stations</h2>
      <FavoriteList favorites={favorites} />
    </div>
  );
}

export default Favorites;