import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { FullWindowImageBox } from "../../components/FullWindowImageBox/FullWindowImageBox";
import { Heading } from "../../components/Heading/Heading";
import { HalfWindowImageBox } from "../../components/HalfWindowImageBox/HalfWindowImageBox";
import { CustomSlider } from "../../components/CustomSlider/CustomSlider";
import "../../assets/scss/partners.scss";
import { usePartnersQuery } from "./PartnersApiSlice";
import { getUserData } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectPartnerList, setPartnerList } from "./PartnerSlice";
interface Partner {
  id: string;
  partner_name: string;
  partner_video_title: string;
  partner_video: string;
  partner_side_image?: string;
  partner_details: string;
  partner_logo: string;
  partner_web_url: string;
  video_file_type: string;
  partner_video_thumb: string;
  partner_side_video?: string;
}
function PartnerList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settings = {
    centerMode: true,
    slidesToShow: 3,
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000,
    variableWidth: false,
    centerPadding: "0%",
    // draggable: false,  
    // swipe: false,
    // touchMove: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0%",
          arrows: false,
        },
      },
    ],
  };

  const settings1 = {
    slidesToShow: 3,
    dots: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "10%",
          arrows: false,
        },
      },
    ],
  };
  const userData = getUserData("userData");
  let memberType = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
    } else {
      // console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const { data, error, isLoading, isSuccess } = usePartnersQuery({});
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [sourceToShow, setSourceToShow] = useState<string>('');
  const [videoExist, setVideoExist] = useState<boolean>(false);
  const [isLoadings, setIsLoading] = useState(true);
  const [slides, setSlides] = useState<{ image: string; alt: string }[]>([]);
  const [videos, setVideos] = useState<
    {
      video: string;
      text: string;
      title: string;
      fileType: string;
      thumbnail: string;
    }[]
  >([]);
  useEffect(() => {
    if (data?.data) {
      dispatch(setPartnerList({ list: data }));
    }

  }, [data, dispatch]);
  const partnerList = useSelector(selectPartnerList);
  useEffect(() => {
    if (!partnerList?.data?.length) return; // Ensure data exists

    setPartnersList(partnerList.data);
    setSourceToShow(partnerList?.filePath + "/" + (partnerList.data[0]?.partner_side_image || ""));
    if (partnerList?.data?.[0]?.partner_side_video) {
      setVideoExist(true);
      setSourceToShow(partnerList?.filePath + "/" + (partnerList.data[0]?.partner_side_video || ""));
    }

    const newSlides = partnerList.data.map((partner: Partner) => ({
      image: partnerList.filePath + "/" + partner.partner_logo,
      alt: partner.partner_name,
      details: partner.partner_details,
      url: partner.partner_web_url,
      partner_id: partner.id,
    }));
    setSlides(newSlides);

    const newVideos = partnerList.data
      .filter((partner: Partner) => partner.partner_video || partner.partner_video_thumb)
      .map((partner: Partner) => ({
        video: partner.partner_video
          ? partner.video_file_type === "File"
            ? partnerList.filePath + "/" + partner.partner_video
            : partner.partner_video
          : "",
        text: partner.partner_video ? partner.partner_name : "",
        title: partner.partner_video ? partner.partner_video_title : "",
        fileType: partner.video_file_type,
        thumbnail: partner.partner_video_thumb
          ? partnerList.filePath + "/" + partner.partner_video_thumb
          : "",
      }));
    setVideos(newVideos);

  }, [partnerList]);

  if (!isSuccess || !partnersList.length) return <div>No partners found.</div>;

  const createHalfWindowBoxes = () => {
    const boxes = [];
    for (let i = 1; i < partnersList.length; i += 2) {
      const url = [
        partnersList[i]?.partner_web_url || "",
        partnersList[i + 1]?.partner_web_url || "",
      ];
      let partnerSideImage = partnersList[i]?.partner_side_image;
      let partnerSideImage1 = partnersList[i + 1]?.partner_side_image;
      let videoExist = false;
      if (partnersList[i]?.partner_side_video !== null) {
        videoExist = true;
        partnerSideImage = partnersList[i]?.partner_side_video;
      }
      if (partnersList[i + 1]?.partner_side_video !== null) {
        partnerSideImage1 = partnersList[i + 1]?.partner_side_video;
      }
      const sources = [partnerSideImage ? data.filePath + "/" + partnerSideImage : ""];

      if (partnerSideImage1) {
        sources.push(data.filePath + "/" + partnerSideImage1);
      }
      const children = [
        <div key={partnersList[i]?.id || `child${i}`}>
          <Heading tag="h2">{partnersList[i]?.partner_name}</Heading>
          <p className="text-white">{partnersList[i]?.partner_details}</p>
        </div>,
        partnersList[i + 1] && (
          <div key={partnersList[i + 1]?.id || `child${i + 1}`}>
            <Heading tag="h2">{partnersList[i + 1]?.partner_name}</Heading>
            <p className="text-white">{partnersList[i + 1]?.partner_details}</p>
          </div>
        ),
      ];
      boxes.push(
        <div>
          {sources && <HalfWindowImageBox
            isVideo={videoExist}
            key={`box${i}`}
            url={url}
            sources={sources}
            children={children}
            navigateTo={true}
            id={parseInt(partnersList[i]?.id)}
          />}
        </div>
      );
    }
    return boxes;
  };

  return (
    <div className="App partners-page">
      <div>
        {sourceToShow && <FullWindowImageBox
          isVideo={videoExist}
          source={sourceToShow}
        >
          <a style={{ cursor: "pointer" }} onClick={() => navigate(`/chandlery`, {
            state: {
              chandlery_id: partnersList[0].id,
            },
          }
          )
          }>
            <Heading tag="h2">{partnersList[0]?.partner_name}</Heading>
          </a>
          <p className="text-white">{partnersList[0]?.partner_details}</p>
          <div className="button-group">
            {!memberType ? (
              <Button
                onClick={() => navigate("/member-signup")}
                text="Sign Up for Free"
                icon={true}
                theme="dark"
              />
            ) : (
              ""
            )}
          </div>
        </FullWindowImageBox>}
        {/* )} */}
      </div>
      {isSuccess && createHalfWindowBoxes()}
      <div className="slider-zoom-items">
        <h2 className="customHeading">OUR PARTNERS</h2>
        <div className="partners-slider">
          <CustomSlider
            settings={settings}
            items={slides}
            className="slider-zoom"
          />
        </div>
        {/* <div className="text-para">
          <p>
            Up to 20% off all Yeti products when using your exclusive REACH
            membership discount code.
          </p>
        </div> */}
      </div>
      <div className="discover-partners">
        <div className="text-head">
          <h2 className="customHeading">DISCOVER OUR PARTNERS</h2>
        </div>
        <CustomSlider settings={settings1} items={videos} isVideo={true} />
      </div>
    </div>
  );
}

export default PartnerList;
