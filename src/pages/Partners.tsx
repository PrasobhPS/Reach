import React from "react";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import "../assets/scss/partners.scss";
import { CmsHeader } from "../components/CmsHeader/CmsHeader";
import PartnerList from "../features/Partners/PartnerList";
import { useNavigate } from "react-router-dom";

function Partners() {
  const navigate = useNavigate();
  return (
    <div className="App partners-page">
      <CmsHeader links={[]}></CmsHeader>
      <PartnerList />
      <div className="enquired-section">
        <div className="container">
          <div className="ext-text">
            <Heading tag="h2">extend the ‘reach’ of your brand</Heading>
            <p className="text-white">
              Selected. Aligned. Connected. Partner with REACH to shape the future of life on the water—together
            </p>
            <div className="Enquire-btn">
              <Button
                onClick={() => navigate('/contact')}
                text="Enquire Now"
                icon={true}
                theme="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Partners;
