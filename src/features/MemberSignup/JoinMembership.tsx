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
import {
    weather,
    events,
    clubs,
    partners,
    chandler,
    clubHouse,
    crewFinder,
    noticeBoard,
    insurance,
} from "../../components/FeaturesCard/FeatureOptions";
import { useMembershipFeeQuery } from "../Login/authApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { CompareMembership } from "./CompareMembership";
import { CmsHeader } from "../../components/CmsHeader/CmsHeader";
import { getUserData } from "../../utils/Utils";
interface MembershipFees {
    full_membership_fee: string;
    monthly_membership_fee: string;
    referal_percentage: string;
}
interface paymentFee {
    currency: string
    fee: string;
    yearly: string;
}
export const JoinMembership = () => {
    const navigate = useNavigate();
    const { referral_code } = useParams<{ referral_code: string }>();
    const [memberShipFee, setMemberShipFee] = useState(0);
    const [yearlyFee, setYearlyFee] = useState(0);
    const getMemberShipFee = useMembershipFeeQuery({});
    const userData = getUserData('userData');

    let memberType = "";
    if (userData != null) {
        memberType = userData.Member_type;
    }

    useEffect(() => {
        if (memberType === "M") navigate("/");

    }, []);
    useEffect(() => {
        if (userData?.currency === 'USD') {
            setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee_dollar);
            setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee_dollar);
        } else if (userData?.currency === 'EUR') {
            setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee_euro);
            setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee_euro);
        } else {
            setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee);
            setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee);
        }
    }, [getMemberShipFee?.data?.data])
    // const freeFeatures = [
    //     'Free for Life',
    //     'Access to Weather Reporting',
    //     'Access to Club House (Chat)',
    //     'Monthly Email Newsletter',
    //     'Access to selected online events',
    //     'Post Job Opportunities within CRUZ',
    // ];
    // const fullFeatures = [
    //     'Full access to the entire site and content',
    //     'Discounts with Selected Partners',
    //     'Book calls with boating experts',
    //     'Browse and accept jobs on CRUZ',
    // ];
    const [paymentFee, setPaymentFee] = useState<paymentFee>();
    const setFees = (code: paymentFee) => {
        setPaymentFee(code);
    }

    return (
        <div className="JoinMembership-parentpage">
            <CmsHeader links={[]}></CmsHeader>
            <div className="innerContent">
                <div className="container">
                    <div className="main-cardsection">
                        <div className="row">
                            <div className="col-md-6 col-12">
                                <MemberShipCard referral_code={referral_code} heading={"Free MemberShip"} type={"Free"} showButton={true} />
                            </div>
                            <div className="col-md-6 col-12">
                                <MemberShipCard referral_code={referral_code} heading={"Full Membership"} plusNote={"As free plus"} membershipFee={memberShipFee} yearlyFee={yearlyFee} type={"Full"} showButton={true} setPaymentFee={setFees} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="compare-cards">
                    <CompareMembership paymentFee={paymentFee} referral_code={referral_code} />
                </div>
            </div>
        </div>
    )
}
export default JoinMembership;