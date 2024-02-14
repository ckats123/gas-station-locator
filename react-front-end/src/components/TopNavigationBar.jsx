import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../styles/TopNavigationBar.scss";
import FavIcon from "../components/FavIcon";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TopNavigationBar = ({setGasStations}) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail"); // Retrieve user's email
  const [searchQuery, setSearchQuery] = useState("");
 // const [gasStations, setGasStations] = useState([]); 
  const [panToUser, setPanToUser] = useState(false); 

  const handleFavIconClick = () => {
    navigate("/favorites");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (action) => {
    setAnchorEl(null);

    switch (action) {
      case "account":
        navigate("/account");
        break;
      case "search":
        navigate("/search");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleSearch = () => {
    console.log("Performing search for:", searchQuery);
    // Perform the search logic and update the map component
    axios.get(`/api/gas-stations/search?keyword=${searchQuery}`)
    .then(response => {
      // Pass the search results to the map component
      setGasStations(response.data);
      console.log(response.data)

      // Update the map center to the user's location
      setPanToUser(true);
    })
    .catch(error => {
      console.error('Error searching gas stations:', error);
    });
  };

  return (
    <nav className="top-navigation-bar">
      <Link to="/home">
        <img src="/logoo.png" alt="Logo" className="logo" />
      </Link>
      <div className="search-bar">
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </div>
      <div className="center-content">
        {isLoggedIn ? (
          <>
            <span>Hello, {userEmail}</span>
            <span onClick={handleFavIconClick} style={{ cursor: "pointer" }}>
              <FavIcon selected="true" />
            </span>
            <MenuIcon
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              style={{ color: "white", marginLeft: "10px" }}
            />
            {open && (
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => handleClose("account")}>
                  Account
                </MenuItem>
                <MenuItem onClick={() => handleClose("search")}>
                  Search
                </MenuItem>
                <MenuItem onClick={() => handleClose("logout")}>
                  Logout
                </MenuItem>
              </Menu>
            )}
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
    
  );
};


export default TopNavigationBar;