import { useNavigate } from "react-router-dom";
import { HalfWindowImageBoxProps } from "../../types";
import "./HalfWindowImageBox.scss";

export const HalfWindowImageBox = (props: HalfWindowImageBoxProps) => {
  const { isVideo, url, sources, children, className, navigateTo, id } = props;
  const firstUrl = url ? url[0] : undefined;
  const secondUrl = url ? url[1] : undefined;
  const navigate = useNavigate();

  const isNavigate = navigateTo && navigateTo;
  const linkProps = isNavigate
    ? { onClick: () => navigate(`/chandlery`, { state: { chandlery_id: id } }) }
    : { href: firstUrl, target: "_blank" };
  const linkPropsSecond = isNavigate
    ? { onClick: () => navigate(`/chandlery`, { state: { chandlery_id: id } }) }
    : { href: secondUrl, target: "_blank" };
  return (
    <div className={`container-fluid g-0 half-window-image-box ${className}`}>
      <div className="row g-0">
        <div className="col-md-6">
          <a style={{ cursor: "pointer" }} {...linkProps}>
            {
              isVideo ? (
                <>
                  <div className='video-box'>
                    <video playsInline muted autoPlay loop>
                      <source src={sources[0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </>
              )
                : (
                  <div className="image-box">
                    <img src={sources[0]} alt="" className="img-fluid" />
                    <div className="content-box">{children[0]}</div>
                  </div>
                )}
          </a>
        </div>
        {sources[1] && (
          <div className="col-md-6">
            <a style={{ cursor: "pointer" }} {...linkPropsSecond}>
              <div className="image-box">
                <img src={sources[1]} alt="" className="img-fluid" />
                <div className="content-box">{children[1]}</div>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
