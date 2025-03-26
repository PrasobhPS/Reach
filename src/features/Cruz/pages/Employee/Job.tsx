import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/cruz.scss";
import { Button } from "../../../../components/Button/Button";
import { useGetProfileDashboardQuery } from "../../Api/ProfileApiSlice";
import { useEmployeeProfileQuery } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useGetAvailableJobsQuery } from "../../Api/ProfileApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserData } from "../../../../utils/Utils";

interface Matches {
    employee_role: string;
    members_name: string;
    members_profile_picture: string;
    date: string;
}

export const EmployeeJobs = () => {
    const { data: dashboardData, error: dashboardError, isLoading: isDashboardLoading, isSuccess: isDashboardSuccess, refetch } = useGetAvailableJobsQuery({});
    const jobCount = dashboardData?.data?.matches;
    const job_ids = dashboardData?.data?.job_ids;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const userData = getUserData("userData");
    const [employeeId, setEmployeeId] = useState<string | undefined>('');

    useEffect(() => {
        const userData = getUserData("userData");
        if (userData !== null) {
            setEmployeeId(userData.employeeId);
        }
        refetch();
    }, []);
    useEffect(() => {
        if (isDashboardLoading) {
            setLoading(true);
        }
        if (isDashboardSuccess) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isDashboardLoading, employeeId, isDashboardSuccess]);

    return (
        <CruzLayout link="Employee">
            <div className="jobFinder-page">
                {loading ? (
                    <div className="page-innerLoader">
                        <div className="spinner-border" role="status">
                            <img src={require("../../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                        </div>
                        <div className="content-txt">
                            <span>Finding Jobs...</span>
                        </div>
                    </div>
                ) : (
                    <div className="jobfinder-result">
                        <h2 className="customHeading">
                            <p>WE’VE FOUND <span className="jobs-count">{jobCount} JOBS</span></p>
                            <span className="matchYou">matched to YOU...</span>
                        </h2>
                        <div className="find-action col-lg-1 offset-md-4">
                            <Button
                                onClick={() =>
                                    jobCount > 0
                                        ? navigate(
                                            `/cruz/employerviewsjobs`,
                                            {
                                                state: {
                                                    employee_id: employeeId,
                                                    job_ids: job_ids,
                                                    jobCount: jobCount,
                                                },
                                            }
                                        )
                                        : navigate(`/cruz/employeedashboard`)
                                }
                                text="Lets Go!"
                                icon={true}
                                theme="light"
                                className=""
                            />
                        </div>
                    </div>
                )}
            </div>
        </CruzLayout>
    );
};

export default EmployeeJobs;
