import { SingleCampaign } from "../SingleCampaign/SingleCampaign";
import "./CampaignList.scss";
import { useLocation } from "react-router-dom";

export const CampaignList = () => {
  return (
    <div className="employer-campaign-list">
      <SingleCampaign />
    </div>
  );
};
