import { FullWindowImageBox } from "../components/FullWindowImageBox/FullWindowImageBox";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import { faHomeAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../utils/Utils";
import "../assets/scss/HomePage.scss";
import { MODAL_TYPES, useGlobalModalContext } from "../utils/GlobalModal";
import { useHomeDetailsQuery } from "../features/Home/HomeApiSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectHomeCms, setHomeCms } from "../features/Home/HomeSlice";


interface HomeData {
  home_page_section_header: string;
  home_page_section_type: string;
  home_page_section_images: string;
  home_page_section_details: string;
  home_page_section_button: string;
  home_page_section_button_link: string;
  home_page_video: string | null;
}
function Home() {
  const [isLoadings, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getUserData("userData");
  let memberType = "";
  let member_id = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
      member_id = userData.Member_id;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  let buttonName = 'Join';
  if (memberType && memberType !== "M") {
    buttonName = 'Upgrade Membership';
  }
  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };

  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const { data: homeData, isLoading, isSuccess, refetch } = useHomeDetailsQuery({});
  const [homeDetails, setHomeDetails] = useState<HomeData[]>([]);
  const [homeVideoDetails, setHomeVideoDetails] = useState<HomeData[]>([]);
  useEffect(() => {
    dispatch(setHomeCms({ cms: homeData }));
  }, [homeData]);
  const homeCms = useSelector(selectHomeCms);
  useEffect(() => {
    if (homeCms) {
      const details = homeCms.data;

      // Add the first item to transformedDataWithVideo
      const transformedDataWithVideo = details.length > 0 ? [{
        home_page_section_header: details[0].home_page_section_header,
        home_page_section_type: details[0].home_page_section_type,
        home_page_section_images: details[0].home_page_section_images,
        home_page_section_details: details[0].home_page_section_details,
        home_page_section_button: details[0].home_page_section_button,
        home_page_section_button_link: details[0].home_page_section_button_link,
        home_page_video: details[0].home_page_video,
      }] : [];

      // Add all other items to transformedData
      const transformedData = details.slice(1).map((item: {
        home_page_section_header: string;
        home_page_section_type: string;
        home_page_section_images: string;
        home_page_section_details: string;
        home_page_section_button: string;
        home_page_section_button_link: string;
        home_page_video: string | null;
      }) => ({
        home_page_section_header: item.home_page_section_header,
        home_page_section_type: item.home_page_section_type,
        home_page_section_images: item.home_page_section_images,
        home_page_section_details: item.home_page_section_details,
        home_page_section_button: item.home_page_section_button,
        home_page_section_button_link: item.home_page_section_button_link,
        home_page_video: item.home_page_video,
      }));

      setHomeVideoDetails(transformedDataWithVideo);
      setHomeDetails(transformedData);
    }
  }, [homeCms]);
  useEffect(() => {
    refetch();
  }, [])

  return (
    <div className="home-content">
      <div className="row mx-0">

        {homeVideoDetails.map((videoDetails, index) => (
          <FullWindowImageBox
            key={`video-${index}`}
            isVideo={true}
            // source={'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg'}
            source={`${baseUrl}/${videoDetails.home_page_video}`}
          >
            <Heading tag="h2">
              <div className="heading-parenthome">
                {videoDetails.home_page_section_header}
              </div>
            </Heading>
            <div className="button-group">
              <Button
                onClick={() => navigate(`/${videoDetails.home_page_section_button_link}`)}
                text={videoDetails.home_page_section_button}
                icon={true}
                theme="light"
              />
              {memberType !== "M" && memberType !== "F" ? (
                <Button
                  onClick={() => navigate('/joinmembership')}
                  text={buttonName}
                  icon={true}
                  theme="dark"
                />
              ) : memberType === "F" ? (
                <Button
                  onClick={() => navigate('/member-signup')}
                  text={buttonName}
                  icon={true}
                  theme="dark"
                />
              ) : ""}
            </div>
          </FullWindowImageBox>
        ))}
        {homeDetails.map((details, index) => {
          let videoExist = false;
          let sourceToShow = `${baseUrl}/${details.home_page_section_images}`;
          if (details.home_page_video !== null) {
            videoExist = true;
            sourceToShow = `${baseUrl}/${details.home_page_video}`
          }
          let halfWidth = '';
          if (details.home_page_section_type === 'H') {
            halfWidth = 'col-md-6 mx-0';
          }

          return (
            <FullWindowImageBox
              key={`detail-${index}`}
              isVideo={videoExist}
              className={halfWidth}
              source={sourceToShow}
            >
              <Heading tag="h2">{details.home_page_section_header}</Heading>
              <p className="text-white">{details.home_page_section_details} </p>
              <div className="button-group">
                <Button
                  onClick={() => {


                    navigate(`/${details.home_page_section_button_link}`)
                  }}
                  text={details.home_page_section_button}
                  icon={true}
                  theme="light"
                />
              </div>
            </FullWindowImageBox>
          );


        })}
      </div>
    </div>
  );
}

export default Home;
