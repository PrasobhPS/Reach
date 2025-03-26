import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft,faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./ImageSlider.scss";
interface Slide {
  image: string;
  alt: string;
  text: string;
}

const ImageSlider = ({ slides }: { slides: Slide[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  return (
    <div className="image-slider">
      <div className="slides-container">
        <div className="nav-buttons">
          <button className="prev" onClick={prevSlide}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button className="next" onClick={nextSlide}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
        <div
          className="slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className={`slide ${index === 2 ? "center" : ""}`} key={index}>
              <img src={slide.image} alt={slide.alt} />
              {index === currentSlide && (
                <div className="text">{slide.text}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
