import React from 'react';
import '../styles/WelcomePage.scss'; // Import CSS file for styling

const WelcomePage = () => {
    return (
      <div className="welcome-page">
        {/* <div className="text-container">
          <h1>Welcome to Gas Station Locator</h1>
          <p>We help you find the best gas prices near you!</p>
        </div> */}

        <div className="container-gas">
          <div className="text-container">
            <h1>Welcome to Gas Station Locator</h1>
            <p>We help you find the best gas prices near you!</p>
          </div>
          <img src = "https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-8/256/Gas-pump-icon.png"/>
        </div>

        <div className="container-map">
          <a href="http://localhost:3000/home">
            <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/256/map-map-marker-icon.png" alt="Find stations based on my position" />
          </a>
        </div>

        <div className="container-fav">
          <a href="http://localhost:3000/favorites">
            <img src=" https://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Places-folder-favorites-icon.png" alt="My favourite stations" />
          </a>
        </div>

        {/* <div className="image-container">
          <img src="/pexels.jpg" alt="Welcome" className="image" />
        </div>  */}
       
      </div>
    );
  };
  
  export default WelcomePage;