import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { CampaignList } from "../../components/CampaignList/CampaignList";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGlobalModalContext,
  MODAL_TYPES,
} from "../../../../utils/GlobalModal";
import { getUserData } from "../../../../utils/Utils";
import { useEffect } from "react";

export const ViewCampaign = () => {
  const userData = getUserData("userData");
  let memberType = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };
  useEffect(() => {
    if (!memberType) memberModal();
  }, []);
  const { params } = useParams();
  return (
    <div className="ViewCampaign-pageComponent">
      <div className="heading-content">
        <h2 className="customHeading">
          {params === "livecampaign"
            ? "live campaigns"
            : params === "draftcampaign"
              ? "Draft campaigns"
              : "Archived campaigns"}
        </h2>
      </div>
      <CruzLayout link="Employer">
        <CampaignList />
      </CruzLayout>
    </div>

  );
};
