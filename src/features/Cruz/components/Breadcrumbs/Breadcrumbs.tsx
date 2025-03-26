import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

interface BreadcrumbsProps {
    mainbreadcrumb: string;
    secondbreadcrumb: string | null;
    thirdbreadcrumb?: string;
    redirectUrl: string;
}
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    mainbreadcrumb,
    secondbreadcrumb,
    thirdbreadcrumb,
    redirectUrl,
}) => {

    const navigate = useNavigate();

    return (
        <div className="page-path">
            <div className="parent-direction">
                <label><a style={{ cursor: "pointer" }} onClick={() => navigate(`${redirectUrl}`)}>{mainbreadcrumb}</a></label>
            </div>
            <span className="direction-arrow">
                <FontAwesomeIcon icon={faAngleRight} />
            </span>
            <div className="child-direction">
                <label>{secondbreadcrumb}</label>
            </div>
            {thirdbreadcrumb && thirdbreadcrumb ? (
                <>
                    <span className="direction-arrow">
                        <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                    <div className="child-direction">
                        <label>{thirdbreadcrumb}</label>
                    </div>
                </>
            ) : ""}
        </div>
    )

}