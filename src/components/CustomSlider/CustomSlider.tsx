import React, { forwardRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "./CustomSlider.scss";
import { CustomSliderProps } from "../../types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Heading } from "../Heading/Heading";
import ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";

export const CustomSlider = forwardRef<Slider, CustomSliderProps>((props, ref) => {
  const { settings, items, className, isVideo } = props;
  const [modal, setModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoTitle, setTitle] = useState<string | undefined>(undefined);
  const [embedUrl, setEmbededUrl] = useState<string | undefined>(undefined);
  const toggle = () => {
    setModal(!modal);
  };
  // let embedUrl: string | undefined = undefined;
  const playVideo = (video: string | undefined, title: string | undefined) => {
    setVideoUrl(video);
    setTitle(title);
    toggle();
  };
  const navigate = useNavigate();
  return (
    <div className="custom-slider-wrapper action-up-arrow">
      <Slider ref={ref} {...settings} className={className} >
        {items &&
          items.map((item, index) => {
            return (
              <div className={`item cursor-pointer ${item?.active ? 'chat-slider-active' : ''}`} key={`slide-${index}`} onClick={() => { if (props.clickCallback && item.room_id) props.clickCallback(item.room_id); }}>
                {isVideo ? (
                  <div className="video-wrapper">
                    {item.thumbnail ? (
                      <div className="image-wrap">
                        <img
                          src={item.thumbnail}
                          alt={item?.alt}
                          className="img-fluid"
                        />
                        <a
                          className="play-button"
                          onClick={() => playVideo(item.video, item.title)}
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </a>
                      </div>
                    ) : (
                      <div>
                        <video
                          className="w-100"
                          controls={false}
                          playsInline
                          src={item.video}
                        ></video>
                        <a
                          className="play-button"
                          onClick={() => playVideo(item.video, item.title)}
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </a>
                      </div>
                    )}
                    {/* <video
                    className="w-100"
                    controls={false}
                    playsInline
                    src={item.video}
                  ></video>
                  <a
                    className="play-button"
                    onClick={() => playVideo(item.video)}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </a> */}
                  </div>
                ) : (item.isLink && item.url ? (
                  <Link to={item.url} className={item?.active ? 'active' : ''}>
                    <img src={item.image} alt={item?.alt} className="img-fluid" />
                  </Link>
                ) : (
                  <a onClick={() => navigate(`/chandlery`, {
                    state: {
                      chandlery_id: item.partner_id,
                    },
                  }
                  )
                  } target="_blank" className={item?.active ? 'active' : ''}>
                    <img src={item.image} alt={item?.alt} className="img-fluid" />
                  </a>)
                )}
                {item.title && <h6 className="itemlist-heading">{item.title}</h6>}
                {item.text && <p className="item-text">{item.text}</p>}
                {item.details && <p className="item-details">{item.details}</p>}

                {/* {item.title && <h6 className="itemlist-heading">{item.text}</h6>}
              {item.text && <p className="item-text">{item.title}</p>}
              {item.details && <p className="item-details">{item.details}</p>} */}

              </div>
            )
          })}
      </Slider>
      <div className="">
        <Modal
          isOpen={modal}
          toggle={toggle}
          centered
          className="videobox-modal"
        >
          <ModalBody>
            <ModalHeader toggle={toggle}>
              <Heading tag="h3" className="text-center">
                {videoTitle}
              </Heading>
            </ModalHeader>
            <div className="video-player">
              <ReactPlayer url={videoUrl} controls={true} />
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
});
export default CustomSlider;