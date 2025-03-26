import React from "react";
import "./Logo.scss";
import logodark from '../../assets/images/logo--dark.svg';
import logowhite from '../../assets/images/logo-white.svg';
import { Link } from "react-router-dom";
function Logo() {
  return (
    <div>
      <Link to={'/'}>
        <img src={logowhite} alt="Logo" className="logoLight" />
        <img src={logodark} alt="Logo Responsive" className="logoDark" id="reach_logo_id" />
      </Link>
    </div>
  );
}

export default Logo;
