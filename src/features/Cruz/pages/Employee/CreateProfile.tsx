import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import "../../../../assets/scss/cruz.scss";
import { ProfileSetup } from "../../../../components/MultiForm/ProfileSetup";
export const CreateProfile = () => {
    return (
        // <CruzLayout></CruzLayout>
        <div className="PostJob-parent">
            <div className="container">
                <ProfileSetup children={undefined}></ProfileSetup>
            </div>
        </div >
    )
}
export default CreateProfile;