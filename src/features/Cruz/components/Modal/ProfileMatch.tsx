import { Button } from "../../../../components/Button/Button";
import { useState, useEffect } from "react";
import "./ModalMatch.scss";
import { getUserData } from "../../../../utils/Utils";
interface ProfileMatchProps {
  handleChat?: () => void;
  handleSubmitNext?: () => void;
  profilePic?: string;
}
export const ProfileMatch: React.FC<ProfileMatchProps> = ({
  handleChat = () => { },
  handleSubmitNext = () => { },
  profilePic,
}) => {

  const userData = getUserData("userData");
  let memberProfilePic = "";
  try {
    if (userData !== null) {
      memberProfilePic = userData.members_profile_picture;
    } else {
      // console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  // if (profilePic)
  //   console.log("profilepic", baseUrl + profilePic);
  return (
    <div className="Employee-ProfilematchModal">
      <div className="row">
        <h2 className="customHeading">IT’S A MATCH!</h2>
        <div className="text-para">
          <p>You’re both interested in each other.</p>
        </div>
        <div className="imagegrid">
          <div className="grid">
            {memberProfilePic ? (
              <img
                src={memberProfilePic}
                alt=""
                className="img-fluid"
              />
            ) : (
              <img
                src={require("../../../../assets/images/profile/Default.jpg")}
                alt="Profile"
                className="img-fluid"
              />
            )}


          </div>
          <div className="grid">
            {profilePic ? (
              <img
                src={baseUrl + profilePic}
                alt=""
                className="img-fluid"
              />
            ) : (
              <img
                src={require("../../../../assets/images/profile/Default.jpg")}
                alt="Profile"
                className="img-fluid"
              />
            )}

          </div>
        </div>
        <div className="chatOption-btn">
          <Button
            onClick={handleChat}
            text="Chat with the Employee"
            icon={true}
            className="chat-optionbtn"
          />
          <a onClick={handleSubmitNext} className="chatlater">
            Continue & chat later
          </a>
        </div>
      </div>
    </div>
  )
}
export default ProfileMatch;