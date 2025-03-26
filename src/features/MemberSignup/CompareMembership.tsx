import { Button } from "../../components/Button/Button";
import { FeaturesCard } from "../../components/FeaturesCard/FeaturesCard";
import { Heading } from "../../components/Heading/Heading";
import {
  weather,
  charter,
  partners,
  expert,
  chandler,
  clubHouse,
  crewFinder,
  messaging,
} from "../../components/FeaturesCard/FeatureOptions";
import { useEffect, useState } from "react";
import {
  useMembershipFeeQuery,
  useReferralDiscountMutation,
} from "../Login/authApiSlice";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utils/Utils";
interface paymentFee {
  currency: string;
  fee: string;
  yearly: string;
}
interface CompareMembershipProps {
  paymentFee?: paymentFee;
  referral_code?: string;
}
interface MembershipFees {
  full_membership_fee: string;
  monthly_membership_fee: string;
  referal_percentage: string;
}

export const CompareMembership = ({
  paymentFee,
  referral_code,
}: CompareMembershipProps) => {
  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const [updatedOfferPrice, setUpdatedOfferPrice] = useState<
    MembershipFees | null | undefined
  >(null);
  const [currency, setCurrency] = useState<string>("GBP");
  const [referralDiscount] = useReferralDiscountMutation();

  const [memberShipFee, setMemberShipFee] = useState(0);
  const [yearlyFee, setYearlyFee] = useState(0);
  const getMemberShipFee = useMembershipFeeQuery({});
  useEffect(() => {
    if (getMemberShipFee?.data?.data.full_membership_fee) {
      setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee);
      setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee);
    }
  }, [getMemberShipFee?.data?.data]);
  useEffect(() => {
    if (paymentFee) {
      setCurrency(paymentFee.currency);
      setMemberShipFee(parseInt(paymentFee.fee, 10));
      setYearlyFee(parseInt(paymentFee.yearly, 10));
    }
  }, [paymentFee]);
  useEffect(() => {
    const fetchReferralDiscount = async () => {
      if (referral_code && currency) {
        try {
          const formData = {
            referral_code: referral_code,
            currency: currency,
          };
          const responseOther = await referralDiscount(formData).unwrap();
          if (responseOther.success) {
            setUpdatedOfferPrice(responseOther.data);
          }
        } catch (error) {
          console.log(error, "ERROR RESPONSE");
        }
      }
    };

    // Call the async function
    fetchReferralDiscount();
  }, [referral_code, currency]);
  const userData = getUserData("userData");
  let memberType = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };
  const [hasCookies, setHasCookies] = useState(false);
  useEffect(() => {
    const cookieValue = getCookie("CookieConsent");
    setHasCookies(!!cookieValue); // Convert to boolean
  }, [document.cookie]);

  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 membership-page">
          <div className="features-block">
            <div className="plus-more">
              <p>COMPARE MEMBERSHIPS</p>
            </div>
            <table className="table access-table">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <div className="text-center">
                      <p className="link-head d-md-block">Open Access</p>
                      <p className="m-0 sub break"></p>
                    </div>
                  </th>
                  <th>
                    <div className="text-center">
                      <p className="link-head d-md-block">Free member</p>
                      <p className="m-0 sub">Free Forever</p>
                    </div>
                  </th>
                  <th className="">
                    <div className="">
                      <p className="link-head d-md-block">Full Member</p>

                      <p className="m-0 sub">
                        {currencySymbols[currency]}
                        {yearlyFee} pa / {currencySymbols[currency]}
                        {memberShipFee} pcm
                      </p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <FeaturesCard options={partners} />
                <FeaturesCard options={weather} />
                <FeaturesCard options={messaging} />
                <FeaturesCard options={clubHouse} />
                <FeaturesCard options={expert} />
                <FeaturesCard options={charter} />
                <FeaturesCard options={chandler} />
                <FeaturesCard options={crewFinder} />

                {/* <FeaturesCard options={events} />
                                <FeaturesCard options={clubs} />
                                <FeaturesCard options={noticeBoard} />
                                <FeaturesCard options={insurance} /> */}
              </tbody>
            </table>
            {!memberType ? (
              <div className="features-footer-block">
                <div className="text-center btn-actions free-membershipbtn">
                  <div className="free-option">
                    <Button
                      onClick={() =>

                        navigate("/freemembership", {
                          state: { referral_code },
                        })
                      }
                      text="Join"
                      icon={true}
                      theme="light"
                      className="btn-freemembership"
                    />
                    <div className="features-footer-blockcaption">
                      <Heading tag="h4">Free Membership</Heading>
                      <p className="m-0 sub">Free</p>
                    </div>
                  </div>
                </div>
                <div className="text-center full-membershipbtn">
                  <div className="full-option">
                    <Button
                      onClick={() =>

                        navigate("/member-signup", {
                          state: {
                            referral_code: referral_code,
                            selectedCurrency: currency,
                          },
                        })
                      }
                      text="Join"
                      icon={true}
                      theme="light"
                    />
                    <div className="features-footer-blockcaption">
                      <Heading tag="h4">Full Membership</Heading>

                      {updatedOfferPrice?.full_membership_fee ? (
                        <>
                          <p className="m-0 sub discountAmnt strike-through">
                            {currencySymbols[currency]}
                            {yearlyFee} pa / {currencySymbols[currency]}
                            {memberShipFee} pcm
                          </p>
                          <p className="m-0 sub">
                            {currencySymbols[currency]}
                            {updatedOfferPrice?.full_membership_fee} pa{" "}
                            <span>
                              ({currencySymbols[currency]}
                              {updatedOfferPrice?.monthly_membership_fee} pcm)
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="m-0 sub">
                          {currencySymbols[currency]}
                          {yearlyFee} pa / {currencySymbols[currency]}
                          {memberShipFee} pcm
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {memberType && memberType !== "M" ? (
              <div className="features-blockontent">
                <div className="membershipfeatures-block second-block fullmemberblockarea">
                  <div className="text-center full-membershipbtn">
                    <Button
                      onClick={() =>

                        navigate("/member-signup", {
                          state: {
                            referral_code: referral_code,
                            selectedCurrency: currency,
                          },
                        })
                      }
                      text="Join"
                      icon={true}
                      theme="light"
                      className="d-sm-none d-md-block"
                    />
                    <Button
                      onClick={() =>

                        navigate("/member-signup", {
                          state: {
                            referral_code: referral_code,
                            selectedCurrency: currency,
                          },
                        })
                      }
                      text="Join"
                      icon={true}
                      theme="light"
                      className="d-sm-block d-md-none"
                    />
                    <div className="features-footer-blockcaption">
                      <Heading tag="h4">Full Membership</Heading>
                      {updatedOfferPrice?.full_membership_fee ? (
                        <>
                          <p className="m-0 sub discountAmnt strike-through">
                            {currencySymbols[currency]}
                            {yearlyFee} pa / {currencySymbols[currency]}
                            {memberShipFee} pcm
                          </p>
                          <p className="m-0 sub">
                            {currencySymbols[currency]}
                            {updatedOfferPrice?.full_membership_fee} pa{" "}
                            <span>
                              ({currencySymbols[currency]}
                              {updatedOfferPrice?.monthly_membership_fee} pcm)
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="m-0 sub">
                          {currencySymbols[currency]}
                          {yearlyFee} pa / {currencySymbols[currency]}
                          {memberShipFee} pcm
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {memberType && memberType === "M" && (
              <div className="features-blockontent memberblock">
                <div className="membershipfeatures-block second-block alreadyMember d-block">
                  <div className="d-block text-center">Full Membership</div>
                  <div className="d-block text center">
                    Current status : Active
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
