import React, { useEffect, useState } from "react";
import { Hero } from "../../components/Hero/Hero";
import { Heading } from "../../components/Heading/Heading";
import { Button } from "../../components/Button/Button";
import "./MembershipSetup.scss";
import { SignupInterface, initialSignupInterface } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { MemberShipCard } from "./MemberShipCard";
import { FeaturesCard } from "../../components/FeaturesCard/FeaturesCard";
import { SignWithGoogle } from "./SignWithGoogle";
import { useLocation, useNavigate } from "react-router-dom";
import { CmsHeader } from "../../components/CmsHeader/CmsHeader";
import { getUserData } from "../../utils/Utils";
export const FreeMembership = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const referral_code = location.state ? location.state : [];
    const freeFeatures = [
        'Free for Life',
        'Access to Weather Reporting',
        'Access to Club House (Chat)',
        'Monthly Email Newsletter',
        'Access to selected online events',
        'Post Job Opportunities within CRUZ',
    ];

    const userData = getUserData('userData');

    let memberType = "";
    if (userData != null) {
        memberType = userData.Member_type;
    }

    useEffect(() => {
        if (memberType === "M") navigate("/");

    }, []);

    return (
        <div className="FreeMembershipCardpage card-parent">
            <CmsHeader links={[]}></CmsHeader>
            <div className="innercontent-section">
                <div className="container">
                    <div className="membership-boxcard">
                        <div className="row">
                            <div className="col-md-6 col-12">
                                <MemberShipCard referral_code={referral_code['referral_code']} heading={"Free MemberShip"} type={"Free"} showButton={false} />
                            </div>
                            <div className="col-md-6 col-12">
                                <SignWithGoogle referral_code={referral_code['referral_code']} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FreeMembership;