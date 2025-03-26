import React from "react";
import "./Logo.scss";
import logodark from '../../assets/images/header/cruz_hover.svg';
import logowhite from '../../assets/images/header/cruz-black.svg';
import { Link } from "react-router-dom";
function CruzLogo() {
    return (
        <div>
            <Link to={'/'}>
                <img src={logowhite} alt="Logo" className="logoLight" />
                <img src={logodark} alt="Logo Responsive" className="logoDark" />
            </Link>
        </div>
    );
}

export default CruzLogo;
