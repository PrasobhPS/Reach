import React, { useState } from "react";
import { Hero } from "../components/Hero/Hero";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import { HalfWindowImageBox } from "../components/HalfWindowImageBox/HalfWindowImageBox";
import { FullWindowImageBox } from "../components/FullWindowImageBox/FullWindowImageBox";
import "../assets/scss/clubhouse.scss";
import { getUserData } from "../utils/Utils";
import { MODAL_TYPES, useGlobalModalContext } from "../utils/GlobalModal";
import { useEffect } from "react";
import { useClubHouseMutation } from "../features/Chat/Api/ClubHouseApiSlice";
import { CmsHeader } from "../components/CmsHeader/CmsHeader";
import { useNavigate } from 'react-router-dom';

interface ClubHouseDetails {
  id: string;
  name: string;
  details: string;
  button: string;
  image: string;
}
function ClubHouse() {
  const userData = getUserData("userData");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  let memberType = "";
  let token = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
      token = userData.Token;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [ClubHouse] = useClubHouseMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setdetails] = useState<ClubHouseDetails[]>([]);
  const fetchClubHouseApi = async () => {
    setIsLoading(true);
    try {
      const response = await ClubHouse(token);
      if ("error" in response) {
        throw new Error("Failed to fetch specialist list");
      }
      const data = await response.data.data;
      const transformedData = data.map((item: {
        id: string;
        club_name: string;
        club_short_desc: string;
        club_image: string;
        club_button_name: string;
        club_image_mob: string;
      }) => ({
        id: item.id,
        name: item.club_name,
        details: item.club_short_desc,
        button: item.club_button_name,
        image: `${response.data.filePath}/${isMobile ? item.club_image_mob ? item.club_image_mob : item.club_image : item.club_image}`,
      }));
      setdetails(transformedData);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!memberType) memberModal();
    if (token) fetchClubHouseApi();
  }, []);

  const firstClubDetails = details[0];
  const remainingClubDetails = details.slice(1);

  const sanitizeText = (text: string) => text.replace(/&amp;/g, '&');

  const navigate = useNavigate();

  const navigateToChat = (roomId: string) => {
    navigate(`/group-chat/${roomId}`);
  };

  return (
    <div className="App clubhouse-section">
      <CmsHeader links={[]} />
      <div className="container-fluid">
        <div className="row">
          {firstClubDetails && (
            <FullWindowImageBox
              isVideo={false}
              source={firstClubDetails.image}
            >
              <Heading tag="h2">{firstClubDetails.name}</Heading>
              <p className="text-white">
                {sanitizeText(firstClubDetails.details)}
              </p>
              <div className="button-group">
                <Button
                  onClick={() => navigateToChat(firstClubDetails.id)}
                  text={firstClubDetails.button}
                  icon={true}
                  theme="light"
                />
              </div>
            </FullWindowImageBox>
          )}
          {remainingClubDetails && remainingClubDetails.map((detail, index) => {
            if (index % 2 === 0 && remainingClubDetails[index + 1]) {
              return (
                <HalfWindowImageBox
                  key={index}
                  className="clubhouse-windowSection"
                  sources={[
                    remainingClubDetails[index].image,
                    remainingClubDetails[index + 1].image,
                  ]}
                  children={[
                    <div key={`${index}-child1`}>
                      <Heading tag="h2">{remainingClubDetails[index].name}</Heading>
                      <p className="text-white">{sanitizeText(remainingClubDetails[index].details)}</p>
                      <div className="button-group">
                        <Button
                          onClick={() => navigateToChat(remainingClubDetails[index].id)}
                          text={remainingClubDetails[index].button}
                          icon={true}
                          theme="light"
                        />
                      </div>
                    </div>,
                    <div key={`${index}-child2`}>
                      <Heading tag="h2">{remainingClubDetails[index + 1].name}</Heading>
                      <p className="text-white">{remainingClubDetails[index + 1].details}</p>
                      <div className="button-group">
                        <Button
                          onClick={() => navigateToChat(remainingClubDetails[index + 1].id)}
                          text={remainingClubDetails[index + 1].button}
                          icon={true}
                          theme="light"
                        />
                      </div>
                    </div>,
                  ]}
                />
              );
            } else if (index % 2 === 0) {
              // Handle the case when there is an odd number of remainingClubDetails
              return (
                <HalfWindowImageBox
                  key={index}
                  className="clubhouse-windowSection"
                  sources={[remainingClubDetails[index].image]}
                  children={[
                    <div key={`${index}-child1`}>
                      <Heading tag="h2">{remainingClubDetails[index].name}</Heading>
                      <p className="text-white">{sanitizeText(remainingClubDetails[index].details)}</p>
                      <div className="button-group">
                        <Button
                          onClick={() => navigateToChat(remainingClubDetails[index].id)}
                          text={remainingClubDetails[index].button}
                          icon={true}
                          theme="light"
                        />
                      </div>
                    </div>,
                  ]}
                />
              );
            }
            return null;
          })}


        </div>
      </div>
    </div >
  );
}

export default ClubHouse;
