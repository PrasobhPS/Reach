import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import "../../../../assets/scss/cruz.scss";
import { MultiForm } from "../../../../components/MultiForm/MultiForm";
export const Job = () => {
    return (
        // <CruzLayout></CruzLayout>
        <div className="PostJob-parent">
            <div className="container">
                <MultiForm children={undefined}></MultiForm>
            </div>
        </div >
    )
}
export default Job;