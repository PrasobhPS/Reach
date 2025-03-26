import React, { useEffect, useState } from "react";
import "./PublicProfile.scss";
import { Hero } from "../Hero/Hero";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetMemberDetailsMutation } from "../../features/Profile/profileApiSlice";
import { useSocket } from "../../contexts/SocketContext";
import { getUserData } from "../../utils/Utils";
interface Details {
   members_fname?: string;
   members_lname?: string;
   members_email?: string;
   members_phone?: string;
   members_dob?: string;
   members_address?: string;
   members_country: string;
   members_town?: string;
   members_street?: string;
   members_region?: string;
   members_profile_picture: string;
   members_interest?: string;
   members_employment: string;
   members_employment_history: string;
   members_biography?: string;
   members_about_me?: string;
}

export const PublicProfile = () => {

   const appLink = process.env.REACT_APP_LINK_URL;
   const fallbackUrl = process.env.REACT_APP_FALLBACK_URL;
   const userData = getUserData("userData");
   const navigate = useNavigate();
   const location = useLocation();
   const id = location.state;
   const [memberId, setMemberId] = useState<number>(location.state || 0);
   const { encodedId } = useParams<{ encodedId: string }>();
   useEffect(() => {
      if (encodedId) {
         try {
            const decodeid = atob(encodedId);
            if (decodeid) {
               window.location.href = `${appLink}publicprofile/${decodeid}` || '';
            }
            if (!userData?.Token) {
               navigate('/');
            }
            setMemberId(parseInt(decodeid));
         } catch (error) {
            navigate('/');
         }



      }
   }, [encodedId])

   const [getDetails, { data, error, isLoading }] = useGetMemberDetailsMutation();
   const [isLoadings, setIsLoading] = useState(false);
   const [profileDetails, setProfileDetails] = useState<Details | null>(null);

   const baseUrl = process.env.REACT_APP_STORAGE_URL;
   const { socket, showChatList, privateMembers: members, messageRequests, privateChatMember, setShowChatList, setIsChatVisible, setPrivateChatMember, setIsInterview, setChatType } = useSocket();


   const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
         const response = await getDetails({ id: memberId });
         if ('data' in response) {
            setProfileDetails(response.data.data);

         } else if ('error' in response) {
            // Handle the error case
            console.error("Error response received:", response.error);
         }
      } catch (error) {
         console.error("Failed to fetch specialist list:", error);
      } finally {
         setIsLoading(false);
      }

   };
   useEffect(() => {
      if (memberId != 0 && userData?.Token) {
         fetchJobDetails();
      }
   }, [memberId]);



   const handleSetPrivateChatMember = () => {
      const searchedMember = members.find(member => member.member_id == id);
      setPrivateChatMember(searchedMember);
      setChatType('PRIVATE');
      setIsInterview(false);
      setIsChatVisible(true);
   };

   return (
      <div className="pubilc-profile-container">
         <Hero
            className="main-baner"
            source={require("../../assets/images/profile/banner-1.jpeg")} title={""} >
         </Hero>
         <div className="profile-area d-lg-flex d-md-flex">
            <div className="left-block">
               <div className="user-img">
                  {profileDetails && profileDetails.members_profile_picture ? (
                     <img
                        src={profileDetails.members_profile_picture}
                        alt=""
                        className="img-fluid"
                     />
                  ) : (
                     <img
                        src={require("../../assets/images/profile/Default.jpg")}
                        alt="Profile"
                        className="profile-image"
                     />
                  )}
               </div>
            </div>
            <div className="right-block">
               {profileDetails && (
                  <>
                     <div className="head-area">
                        {profileDetails.members_fname && profileDetails.members_lname && (
                           <h3>{profileDetails.members_fname} {profileDetails.members_lname}</h3>
                        )}
                        {profileDetails.members_employment && (
                           <span>{profileDetails.members_employment}</span>
                        )}
                        <button className={userData?.Member_id != id ? "btn btn-message" : "d-none"} onClick={() => handleSetPrivateChatMember()}>
                           Message {profileDetails.members_fname} <span className="icon"><FontAwesomeIcon icon={faAngleRight} /></span>
                        </button>
                     </div>
                     <div className="profile-details">
                        {profileDetails.members_email && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Email
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_email}
                              </div>
                           </div>
                        )}
                        {profileDetails.members_phone && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Phone
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_phone}
                              </div>
                           </div>
                        )}

                        {profileDetails.members_address && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Address
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_address}
                              </div>
                           </div>
                        )}

                        {profileDetails.members_town && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Town
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_town}
                              </div>
                           </div>
                        )}

                        {profileDetails.members_region && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Region / County
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_region}
                              </div>
                           </div>
                        )}

                        {profileDetails.members_country && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Country
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_country}
                              </div>
                           </div>
                        )}
                        {profileDetails.members_employment && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Current Employment
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_employment}
                              </div>
                           </div>
                        )}
                        {profileDetails.members_employment_history && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Employment History
                              </div>
                              <div className="data  col-md-8">
                                 <div className="text-white text-custom"
                                    dangerouslySetInnerHTML={{ __html: profileDetails.members_employment_history }}
                                 />
                              </div>
                           </div>
                        )}
                        {profileDetails.members_biography && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 About Me
                              </div>
                              <div className="data  col-md-8">
                                 <div className="text-white text-custom"
                                    dangerouslySetInnerHTML={{ __html: profileDetails.members_biography }}
                                 />
                              </div>
                           </div>
                        )}
                        {profileDetails.members_interest && (
                           <div className="pro-outer row mx-0">
                              <div className="data head col-md-4">
                                 Interests
                              </div>
                              <div className="data  col-md-8">
                                 {profileDetails.members_interest}
                              </div>
                           </div>
                        )}

                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default PublicProfile;