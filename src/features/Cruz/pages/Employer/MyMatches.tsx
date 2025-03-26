import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/cruz.scss";
import { useMyMatchesListQuery } from "../../Api/CampaignApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { LikeCard } from "../../components/LikeCard/LikeCard";
import { useSocket } from "../../../../contexts/SocketContext";
import { useState } from "react";
import { EmployeeInterface, MemberInterface } from "../../../../types/PrivateChatInterfaces";
import SingleChatMain from "../../../Chat/PrivateChat/SingleChatMain/SingleChatMain";
import { useGetChatMemberMutation } from "../../Api/CruzMainApiSlice";
interface Matches {
  id: number;
  employee_role: string;
  member_name: string;
  members_profile_picture: string;
  date: string;
  member_id: number;
}

export const MyMatches = () => {

  const location = useLocation();
  const { id, job_role } = location.state || {};
  const { data, error, isLoading, isSuccess } = useMyMatchesListQuery({ id });
  const matches: Matches[] = data?.data;
  const [chatMemberDetails] = useGetChatMemberMutation();
  const { setIsChatVisible, setPrivateChatMember, setIsInterview, setEmployeeDetails, setChatType } = useSocket();
  const handleChat = async (employeeId: number) => {
    let profileData = {
      type: 'employee',
      id: employeeId,
    }
    const response = await chatMemberDetails(profileData);
    if ('data' in response && response.data) {
      setIsInterview(true);
      setChatType('CRUZ');
      setPrivateChatMember(response.data.data);
      setIsChatVisible(true);
      if (id) {
        setEmployeeDetails({
          employee_id: employeeId,
          job_id: parseInt(id, 10)
        });
      }
    }

  };
  return (
    <CruzLayout link="Employer">
      <div className="myMatches">
        <Breadcrumbs
          mainbreadcrumb="Live Campaign"
          secondbreadcrumb={job_role}
          redirectUrl="/cruz/viewcampaign/livecampaign"
          thirdbreadcrumb="My Matches"
        />
        <div className="innerHeading">
          <h2 className="customHeading">
            MY MATCHES for
            <br></br>
            <span>{job_role}</span>
          </h2>
        </div>
        <LikeCard matches={matches} getId={id} type={"employer"} handleLike={handleChat} showButton={false} />
      </div>
    </CruzLayout>
  );
};
export default MyMatches;
