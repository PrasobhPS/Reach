import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./MenuSLider.scss";
interface links {
  url: string;
  text: string;
}
const MenuSlider = ({ links }: { links: links[] }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setCurrentPosition(Math.max(0, currentPosition - 1));
  };

  const handleNext = () => {
    setCurrentPosition(Math.min(links.length - 8, currentPosition + 1));
  };

  const handleLinkClick = (index: any) => {
    setActiveIndex(index);
  };

  return (
    <div
      className="menu-slider">
      <div className="col-auto previous-btn">
        <button
          className="prev  btn btn-circle"
          onClick={handlePrev}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      </div>
      <div className="col menu-column">
        <div className="menu">
          <div className="row menu-wrap">
            {links
              .slice(currentPosition * 8, currentPosition * 8 + 8)
              .map((link, index) => (
                <div className="col menu-items" key={index}>
                  <a
                    href={link.url}
                    className="nav-link"
                    onClick={() =>
                      handleLinkClick(currentPosition * 8 + index)
                    }
                    style={{
                      borderBottom:
                        activeIndex === currentPosition * 8 + index
                          ? "1px solid #ff0075"
                          : "none",
                    }}
                  >
                    {link.text}
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="col-auto next-btn">
        <button
          className="next btn btn-circle"
          onClick={handleNext}
          style={{
            borderRadius: "50%",
            color: "#fff",
            padding: "10px",
            border: "1px solid",
          }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
};

export default MenuSlider;
