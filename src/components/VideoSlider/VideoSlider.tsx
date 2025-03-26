import React, { useState } from "react";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./VideoSlider.scss";
interface Video {
  source: string;
  alt: string;
  text: string;
}

const VideoSlider = ({ videos }: { videos: Video[] }) => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const nextVideo = () => {
    setCurrentVideo(
      currentVideo === Math.ceil(videos.length / 3) - 1 ? 0 : currentVideo + 1
    );
  };

  const prevVideo = () => {
    setCurrentVideo(
      currentVideo === 0 ? Math.ceil(videos.length / 3) - 1 : currentVideo - 1
    );
  };

  return (
    <div className="video-slider">
      <div className="slides-container">
        <div className="nav-buttons">
          <button className="prev" onClick={prevVideo}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button className="next" onClick={nextVideo}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
        <div
          className="videos"
          style={{ transform: `translateX(-${currentVideo * 100}%)` }}
        >
          {videos
            .slice(currentVideo * 3, currentVideo * 3 + 3)
            .map((video, index) => (
              <div className="video-slide" key={index}>
                <video controls>
                  <source src={video.source} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="text">{video.text}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;
