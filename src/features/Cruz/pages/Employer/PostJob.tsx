import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import "../../../../assets/scss/cruz.scss";
import {MultiStepForm} from "../../../../components/MultiStepForm/MultiStepForm";
export const PostJob = () =>{
    return(
        // <CruzLayout></CruzLayout>
        <div className="PostJob-parent">
           <div className="container">
                <div className="row">
                    <div className="page-path">
                        <div className="parent-direction">
                            <label>Campaigns</label>
                        </div>
                        <span className="direction-arrow">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </span>
                        <div className="child-direction">
                            <label>Post a new Campaign</label>
                        </div>
                    </div>
                    <MultiStepForm children={undefined}></MultiStepForm>
                </div>
           </div>
        </div>
    )
}
export default PostJob;