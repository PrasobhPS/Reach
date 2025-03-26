import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons"
import "../../../../assets/scss/cruz.scss";
import { useEmployeeLikedJobQuery, useUnlikeEmployeeMutation } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useEffect, useState } from "react";
import { getUserData } from "../../../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
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

export const EmployeeLikedJobs = () => {

    const { data, error, isLoading, isSuccess, refetch } = useEmployeeLikedJobQuery({});
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
    const [loading, setLoading] = useState(false);
    const userData = getUserData('userData');
    let memberName = '';
    if (userData) {
        memberName = userData.Member_fullname;
    }
    const navigate = useNavigate();
    useEffect(() => {
        refetch();
    }, []);

    const [unLikeEmployee] = useUnlikeEmployeeMutation();
    const [employeeId, setEmployeeId] = useState<string | undefined>('');
    useEffect(() => {
        if (userData) {
            setEmployeeId(userData.employeeId);
        }
    }, [userData]);
    const handleDisLike = async (jobId: number) => {
        try {
            setLoading(true);
            let profileData = {
                employee_id: employeeId,
                job_id: jobId,
            }
            const response = await unLikeEmployee(profileData);
            if ('data' in response && response.data) {
                refetch();
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
                                Liked Jobs
                            </h2>
                        </div>
                        <LikeCard type={"employee"} getId={employeeId} matches={matches} handleLike={handleDisLike} from="Liked" />
                    </div >
                )}
            </CruzLayout >
        </div >
    )
}
export default EmployeeLikedJobs;