import React, { useEffect, useState } from "react";
import { Hero } from "../../components/Hero/Hero";
import { Heading } from "../../components/Heading/Heading";
import "./Membersignup.scss";
import { FormProvider, useForm } from "react-hook-form";
import { SignupInterface, initialSignupInterface } from "../../types";
import {
  useIosloginMutation,
  useMemberSignupMutation,
  useMemberUpdateMutation,
} from "../Login/authApiSlice";
import { getUserData, setUserData } from "../../utils/Utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProfileMutation } from "../Profile/profileApiSlice";
import { ProfileData, initialProfileData } from "../../types/ProfileData";
import { FullWindowImageBox } from "../../components/FullWindowImageBox/FullWindowImageBox";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import MemberShipCard from "./MemberShipCard";
import MemberSignForm from "./MemberSignForm";
import { useMembershipFeeQuery } from "../Login/authApiSlice";
import { CmsHeader } from "../../components/CmsHeader/CmsHeader";
interface LocalData {
  members_profile_picture: string;
  Member_fullname: string;
  Member_type: string;
  Token: string;
  Member_id: string;
  IsEmployer: string;
  IsEmployee: string;
  is_specialist: string;
}
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
type Currency = "USD" | "GBP" | "EUR";
function MemberSignup() {
  const navigate = useNavigate();
  const [memberShipFee, setMemberShipFee] = useState(0);
  const [yearlyFee, setYearlyFee] = useState(0);
  const getMemberShipFee = useMembershipFeeQuery({});
  useEffect(() => {
    if (getMemberShipFee?.data?.data.full_membership_fee) {
      setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee);
      setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee);
    }
  }, [getMemberShipFee?.data?.data]);

  const { ios_token } = useParams<{ ios_token: string }>();


  const localData: LocalData | null = getUserData("userData");

  const location = useLocation();
  const { email, memberName, googleToken, phoneNumber, referral_code, selectedCurrency } = location.state || {};
  const [referralCode, setReferralCode] = useState<string>('');
  const [offerPrice, setOfferPrice] = useState<MembershipFees | null>(null);
  const effectiveReferralCode = referral_code || referralCode;
  const [currency, setCurrency] = useState<Currency>(selectedCurrency || 'GBP');
  let token = "";
  let memberType = "";
  if (localData != null) {
    token = localData.Token;
    memberType = localData.Member_type;
  }

  useEffect(() => {
    if (memberType === "M") navigate("/");

  }, []);
  // 
  const fullFeatures = [
    'Full access to the entire site and content',
    'Discounts with Selected Partners',
    'Book calls with boating experts',
    'Browse and accept jobs on CRUZ',
  ];
  const freeFeatures = [
    'Free for Life',
    'Access to Weather Reporting',
    'Access to Club House (Chat)',
    'Monthly Email Newsletter',
    'Access to selected online events',
    'Post Job Opportunities within CRUZ',
  ];

  const setFunction = (code: MembershipFees | null) => {
    setOfferPrice(code);
  }
  const setReferral = (code: string) => {
    setReferralCode(code);
  }
  const setCardCurrency = (currency: "USD" | "GBP" | "EUR") => {
    setCurrency(currency);
  }
  const [paymentFee, setPaymentFee] = useState<paymentFee>();
  const setFees = (code: paymentFee) => {
    setPaymentFee(code);
  }
  return (
    <div className="MemberSignup">
      <CmsHeader links={[]}></CmsHeader>
      <div className="signup-box">
        <div className="signup-box-inner">
          <div className="box-innercontents">
            <div className="row ">
              <div className="col-md-6 col-12">
                <div className="fullMembership-card">
                  {email ? (
                    <MemberShipCard referral_code={effectiveReferralCode} heading={"Free Membership"} type={"Free"} showButton={false} />
                  ) : (
                    <MemberShipCard referral_code={effectiveReferralCode} currency={currency} setCardCurrency={setCardCurrency} offerPrice={offerPrice} heading={" Full Membership"} plusNote={"As free plus"} membershipFee={memberShipFee} yearlyFee={yearlyFee} type={"Full"} showButton={false} setPaymentFee={setFees} />
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 content-box">
                <MemberSignForm setFunction={setFunction} ios_token={ios_token} setRefferal={setReferral} currency={currency} paymentFee={paymentFee} monthlyFee={memberShipFee} yearlyFee={yearlyFee} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="membership-heighlights d-none">
        <h2 className="customHeading">MEMBERSHIP HIGHLIGHTS</h2>
        <div className="box-card">
          <div className="row">
            <div className="col-md-6 col-12">
              <FullWindowImageBox
                isVideo={false}
                className="odd"
                source={require("../../assets/images/membersignup/card-1.png")}
              >
                <Heading tag="h2">CHANDLERY</Heading>
                <p className="text-para">
                  Lorem ipsum dolor sit amet consectetur. Nunc lectus turpis
                  tempor vitae gravida. Rhoncus nisi nulla morbi.
                </p>
              </FullWindowImageBox>
            </div>
            <div className="col-md-6 col-12">
              <FullWindowImageBox
                isVideo={false}
                className="even"
                source={require("../../assets/images/membersignup/card-2.png")}
              >
                <Heading tag="h2">SPEAK TO EXPERTS</Heading>
                <p className="text-para">
                  Lorem ipsum dolor sit amet consectetur. Nunc lectus turpis
                  tempor vitae gravida. Rhoncus nisi nulla morbi.
                </p>
              </FullWindowImageBox>
            </div>
            <div className="col-md-6 col-12">
              <FullWindowImageBox
                isVideo={false}
                className="odd"
                source={require("../../assets/images/membersignup/card-3.png")}
              >
                <Heading tag="h2">CRUZ</Heading>
                <p className="text-para">
                  Lorem ipsum dolor sit amet consectetur. Nunc lectus turpis
                  tempor vitae gravida. Rhoncus nisi nulla morbi.
                </p>
              </FullWindowImageBox>
            </div>
            <div className="col-md-6 col-12">
              <FullWindowImageBox
                isVideo={false}
                className="even"
                source={require("../../assets/images/membersignup/card-4.png")}
              >
                <Heading tag="h2">club house</Heading>
                <p className="text-para">
                  Lorem ipsum dolor sit amet consectetur. Nunc lectus turpis
                  tempor vitae gravida. Rhoncus nisi nulla morbi.
                </p>
              </FullWindowImageBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberSignup;
