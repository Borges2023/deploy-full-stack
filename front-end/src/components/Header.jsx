import React from "react";
import riffly from "../assets/logo/riffly.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <Link to="/">
        <img src={riffly} alt="Riffly" />
      </Link>

      <Link to="/" className="header__link">
        <h1>Riffly</h1>
      </Link>
    </div>
  );
};

export default Header;
