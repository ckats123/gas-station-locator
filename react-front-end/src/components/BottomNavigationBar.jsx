import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WebIcon from "@mui/icons-material/Web";
import "../styles/BottomNavigationBar.scss";

const BottomNavigationBar = () => {
    return (
        <nav className="bottom-navigation-bar">
          <div className="brand-text">GAS STATION LOCATOR</div>
          <div className="icons">
            <div className="icons-container">
              <Link to="/aboutus">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Link>
              <a
                href="https://github.com/ckats123/gas-station-locator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <WebIcon />
                </IconButton>
              </a>
            </div>
          </div>
          <div className="empty-column"></div>
        </nav>
      );
    };
    
export default BottomNavigationBar;
