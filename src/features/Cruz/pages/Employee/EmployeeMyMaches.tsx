import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons"
import "../../../../assets/scss/cruz.scss";
import { useEmployeeMyMatchesQuery } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../../../utils/Utils";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { LikeCard } from "../../components/LikeCard/LikeCard";
import SingleChatMain from "../../../Chat/PrivateChat/SingleChatMain/SingleChatMain";
import { useSocket } from "../../../../contexts/SocketContext";
import { useEffect, useState } from "react";
import { EmployeeInterface, MemberInterface } from "../../../../types/PrivateChatInterfaces";
import { useGetChatMemberMutation } from "../../Api/CruzMainApiSlice";

interface RawData {
    date: string;
    id: number;
    job_images: string;
    job_location: string;
    job_role: string;
    member_id: number;
    member_name: string;
}
interface Matches {
    id: number;
    employee_role: string;
    member_name: string;
    members_profile_picture: string;
    date: string;
    member_id: number;
}

export const EmployeeMyMatches = () => {

    const { data, error, isLoading, isSuccess } = useEmployeeMyMatchesQuery({});
    const rawData: RawData[] = data?.data;
    const matches: Matches[] = rawData?.map(item => ({
        id: item.id,
        employee_role: item.job_role,
        member_name: item.member_name,
        members_profile_picture: item.job_images,
        date: item.date,
        member_id: item.member_id,
    }));
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const navigate = useNavigate();
    const userData = getUserData('userData');
    const [employeeId, setEmployeeId] = useState<string | undefined>('');
    let memberName = '';

    useEffect(() => {
        if (userData) {
            memberName = userData.Member_fullname;
            setEmployeeId(userData.employeeId);
        }
    }, [userData])
    const { setIsChatVisible, setPrivateChatMember, setIsInterview, setEmployeeDetails, setChatType } = useSocket();
    const [chatMemberDetails] = useGetChatMemberMutation();

    const handleChat = async (jobId: number) => {
        let profileData = {
            id: jobId,
            type: 'employer',
        }
        const response = await chatMemberDetails(profileData);
        if ('data' in response && response.data) {
            setIsInterview(false);
            setChatType('CRUZ');
            setPrivateChatMember(response.data.data);
            setIsChatVisible(true);
            if (employeeId) {
                setEmployeeDetails({
                    employee_id: employeeId,
                    job_id: jobId
                });
                //setPrivateChatMember(matches);
                setIsChatVisible(true);
            }
        }
    };
    return (
        <div>
            <CruzLayout link="Employee">
                <div className="myMatches">
                    <Breadcrumbs mainbreadcrumb="Dashboard" secondbreadcrumb={memberName} redirectUrl="/cruz/employeedashboard" />

                    <div className="innerHeading">
                        <h2 className="customHeading">
                            MY MATCHES
                        </h2>
                    </div>
                    <LikeCard matches={matches} type={"employee"} getId={employeeId} handleLike={handleChat} showButton={false} />
                </div >
            </CruzLayout >
        </div >
    )
}
export default EmployeeMyMatches;