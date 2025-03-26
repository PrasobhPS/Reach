import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { EmployeeProfile } from "../../components/EmployeeProfile/EmployeeProfile";
import { CruzLayout } from '../../../../components/Layout/CruzLayout';
import { useEmployeeProfileQuery } from '../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice';

interface Media {
    id: number;
    media_file: string;
}
export const PreviewEmployee = () => {

    const { data, error, isLoading, isSuccess } = useEmployeeProfileQuery({});
    const employeeProfile = data?.data.employeeDetails;
    const medias: Media[] = data?.data.mediaDetails || [];

    return (
        <div className="viewProfile employer-profileparent">
            <div className="center-layout">
                <div className="page-path">
                    <div className="parent-direction">
                        <label>Profile</label>
                    </div>
                    <span className="direction-arrow">
                        <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                    <div className="child-direction">
                        <label>{employeeProfile?.employee_role} {employeeProfile?.employee_avilable} {employeeProfile?.employee_location}</label>
                    </div>
                </div>
                <EmployeeProfile employeeProfile={employeeProfile} medias={medias} />
            </div>
        </div>
    )
}
export default PreviewEmployee;