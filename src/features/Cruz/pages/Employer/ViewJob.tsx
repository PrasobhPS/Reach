import { useParams } from "react-router-dom";
import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { EmployerProfile } from "../../components/EmployerProfile/EmployerProfile";
import { useEmployerProfileQuery } from "../../components/EmployerProfile/EmployerProfileApiSlice";
interface Media {
  media_file: string;
}
export const ViewJob = () => {

  const { id } = useParams();
  const { data, error, isLoading, isSuccess } = useEmployerProfileQuery({ id });
  const jobProfile = data?.data.jobDetails;
  const medias: Media[] = data?.data.mediaDetails || [];
  return (
    <div className="viewProfile employer-profileparent cardcommonparent">
      <CruzLayout link="Employer">
        <EmployerProfile jobProfile={jobProfile} medias={medias} from="Employer" />
      </CruzLayout>
    </div>
  );
};
export default ViewJob;
