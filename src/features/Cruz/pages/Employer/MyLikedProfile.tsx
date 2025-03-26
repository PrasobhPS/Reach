import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/cruz.scss";
import { useMyLikedListQuery } from "../../Api/CampaignApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { useUnLikeCampaignMutation } from "../../components/EmployerProfile/EmployerProfileApiSlice";
import { LikeCard } from "../../components/LikeCard/LikeCard";
interface Matches {
    id: number;
    employee_role: string;
    member_name: string;
    members_profile_picture: string;
    date: string;
}

export const MyLikedProfile = () => {
    const location = useLocation();
    const { id, job_role } = location.state || {};
    const { data, error, isLoading, isSuccess, refetch } = useMyLikedListQuery({ id });
    const matches: Matches[] = data?.data;
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    useEffect(() => {
        refetch();
    }, []);
    const navigate = useNavigate();

    const [unLikeCampaign] = useUnLikeCampaignMutation();

    const handleDisLike = async (employeeId: number) => {
        try {
            setLoading(true);
            let profileData = {
                job_id: id,
                employee_id: employeeId,
            }
            const response = await unLikeCampaign(profileData);
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
        <CruzLayout link="Employer">
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
                    <Breadcrumbs
                        mainbreadcrumb="Live Campaign"
                        secondbreadcrumb={job_role}
                        redirectUrl="/cruz/viewcampaign/livecampaign"
                        thirdbreadcrumb="My Liked"
                    />

                    <div className="innerHeading">
                        <h2 className="customHeading">
                            Profiles I liked for
                            <br></br>
                            <span>{job_role}</span>
                        </h2>
                    </div>
                    <LikeCard matches={matches} getId={id} type={"employer"} handleLike={handleDisLike} from="Liked" />
                </div>
            )}
        </CruzLayout>
    );
};
export default MyLikedProfile;
