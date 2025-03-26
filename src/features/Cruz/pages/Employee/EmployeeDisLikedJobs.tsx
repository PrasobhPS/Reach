import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons"
import "../../../../assets/scss/cruz.scss";
import { useEmployeeDisLikedJobQuery, useLikeEmployeeMutation } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useEffect, useState } from "react";
import { getUserData } from "../../../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { EmployeeInterface, MemberInterface } from "../../../../types/PrivateChatInterfaces";
import { useSocket } from "../../../../contexts/SocketContext";
import { LikeCard } from "../../components/LikeCard/LikeCard";

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

export const EmployeeDisLikedJobs = () => {

    const { data, error, isLoading, isSuccess, refetch } = useEmployeeDisLikedJobQuery({});
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
    const userData = getUserData('userData');
    let memberName = '';
    const [employeeId, setEmployeeId] = useState<string | undefined>('');
    if (userData) {
        memberName = userData.Member_fullname;
    }
    useEffect(() => {
        if (userData) {
            setEmployeeId(userData.employeeId);
        }
    }, [userData]);
    const navigate = useNavigate();
    useEffect(() => {
        refetch();
    }, []);

    const [likeEmployee] = useLikeEmployeeMutation();
    const [profilePic, setProfilePic] = useState();
    const { setPrivateChatMember, setIsChatVisible, setChatType } = useSocket();
    const [chatEmpDetails, setChatEmpDetails] = useState<EmployeeInterface>();
    const [loading, setLoading] = useState(false);
    const handleLike = async (jobId: number) => {
        try {
            setLoading(true);
            let profileData = {
                employee_id: employeeId,
                job_id: jobId,
            }
            const response = await likeEmployee(profileData);
            if ('data' in response && response.data) {
                refetch();
                if (response.data.is_match === 'Y') {

                    setProfilePic(response.data.data.member_profile_picture);
                    setChatType('CRUZ');
                    setPrivateChatMember(response.data.data);
                    setIsChatVisible(true);
                    if (profileData.employee_id && profileData.job_id) {
                        setChatEmpDetails({
                            employee_id: profileData.employee_id,
                            job_id: profileData.job_id
                        });
                    }

                }

            }
        } catch (error) {
            console.error("Error fetching available jobs:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <CruzLayout link="Employee">
                {loading ? (
                    <div className="page-loader">
                        <div className="page-innerLoader">
                            <div className="spinner-border" role="status">
                                <img src={require("../../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="myMatches">
                        <Breadcrumbs mainbreadcrumb="Dashboard" secondbreadcrumb={memberName} redirectUrl="/cruz/employeedashboard" />

                        <div className="innerHeading">
                            <h2 className="customHeading">
                                Disliked Jobs
                            </h2>
                        </div>
                        <LikeCard type={"employee"} getId={employeeId} matches={matches} handleLike={handleLike} from="DisLiked" />
                    </div >
                )}
            </CruzLayout >
        </div >
    )
}
export default EmployeeDisLikedJobs;