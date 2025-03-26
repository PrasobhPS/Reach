import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import "./MembershipSetup.scss";
import { useNavigate } from "react-router-dom";
import { MemebershipProps } from "../../types";
import {
  useReferralDiscountMutation,
  useMembershipFeeQuery,
  useJoinReachQuery,
} from "../Login/authApiSlice";

type Currency = "USD" | "GBP" | "EUR";
interface MembershipFees {
  full_membership_fee: string;
  monthly_membership_fee: string;
  referal_percentage: string;
}
export const MemberShipCard: React.FC<MemebershipProps> = ({
  referral_code,
  heading,
  plusNote,
  membershipFee,
  yearlyFee,
  type,
  showButton,
  offerPrice,
  currency,
  setPaymentFee,
  setCardCurrency,
}) => {
  const navigate = useNavigate();
  const [referralDiscount] = useReferralDiscountMutation();
  const { data, error, isLoading, isSuccess } = useMembershipFeeQuery({});
  const [currencySelected, setCurrency] = useState<Currency>(currency || "GBP");
  const [fees, setFees] = useState({
    fee: membershipFee,
    yearly: yearlyFee,
  });
  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  const [updatedOfferPrice, setUpdatedOfferPrice] = useState<
    MembershipFees | null | undefined
  >(null);

  useEffect(() => {
    setUpdatedOfferPrice(offerPrice);
  }, [offerPrice]);
  useEffect(() => {
    if (isSuccess && data) {
      const feeArr: Record<Currency, { fee: any; monthly: any }> = {
        USD: {
          fee: data.data.full_membership_fee_dollar,
          monthly: data.data.monthly_membership_fee_dollar,
        },
        GBP: {
          fee: data.data.full_membership_fee,
          monthly: data.data.monthly_membership_fee,
        },
        EUR: {
          fee: data.data.full_membership_fee_euro,
          monthly: data.data.monthly_membership_fee_euro,
        },
      };

      const defaultFees = {
        fee: feeArr[currencySelected].monthly,
        yearly: feeArr[currencySelected].fee,
      };

      setFees(defaultFees);

      // Ensure setPaymentFee is called with default values
      if (setPaymentFee) {
        setPaymentFee({
          currency: currencySelected,
          fee: defaultFees.fee,
          yearly: defaultFees.yearly,
        });
      }
    }
  }, [isSuccess, data, currencySelected]);


  useEffect(() => {
    const fetchReferralDiscount = async () => {
      if (referral_code) {
        try {
          const formData = {
            referral_code: referral_code,
            currency: currencySelected,
          };
          const responseOther = await referralDiscount(formData).unwrap();
          if (responseOther.success) {
            setUpdatedOfferPrice(responseOther.data);

            if (setPaymentFee) {
              setPaymentFee({
                currency: currencySelected,
                fee: responseOther.data.monthly_membership_fee,
                yearly: responseOther.data.full_membership_fee,
              });
            }

          }
        } catch (error) {
          //console.log(error, "ERROR RESPONSE");
        }
      }
    };

    // Call the async function
    fetchReferralDiscount();
  }, [referral_code, currencySelected]);

  const handleCurrencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCurrency = e.target.value as Currency; // Cast to Currency type
    setCurrency(selectedCurrency);
    if (setCardCurrency) {
      setCardCurrency(selectedCurrency);
    }
    if (data) {
      const feeArr: Record<Currency, { fee: any; monthly: any }> = {
        USD: {
          fee: data.data.full_membership_fee_dollar,
          monthly: data.data.monthly_membership_fee_dollar,
        },
        GBP: {
          fee: data.data.full_membership_fee,
          monthly: data.data.monthly_membership_fee,
        },
        EUR: {
          fee: data.data.full_membership_fee_euro,
          monthly: data.data.monthly_membership_fee_euro,
        },
      };

      setFees({
        fee: feeArr[selectedCurrency].monthly,
        yearly: feeArr[selectedCurrency].fee,
      });
      if (setPaymentFee) {
        setPaymentFee({
          currency: selectedCurrency,
          fee: feeArr[selectedCurrency].monthly,
          yearly: feeArr[selectedCurrency].fee,
        });
      }
      if (referral_code) {
        try {
          const formData = {
            referral_code: referral_code,
            currency: selectedCurrency,
          };
          const responseOther = await referralDiscount(formData).unwrap();
          if (responseOther.success) {
            setUpdatedOfferPrice(responseOther.data);
          }
        } catch (error) {
          //console.log(error, "ERROR RESPONSE");
        }
      }
    }
  };

  const [freeFeatures, setFreeFeatures] = useState("");
  const [fullFeatures, setFullFeatures] = useState("");
  const [freeheading, setFreeHeading] = useState("");
  const [fullheading, setFullHeading] = useState("");
  const {
    data: joinReachDetails,
    isLoading: joinReachLoading,
    isSuccess: joinReachSuccess,
  } = useJoinReachQuery({});
  useEffect(() => {
    if (joinReachSuccess && joinReachDetails?.data) {
      const featureData = joinReachDetails.data;
      setFreeFeatures(featureData[0]?.membership_description || "");
      setFreeHeading(featureData[0]?.membership_title || "");
      setFullFeatures(featureData[1]?.membership_description || "");
      setFullHeading(featureData[1]?.membership_title || "");
    } else {
      console.warn("joinReachDetails or data is missing");
    }
  }, [joinReachDetails, joinReachSuccess]);

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

  const handleClick = () => {
    //if (hasCookies) {
    if (type === "Free") {
      navigate(`/freemembership`, {
        state: { referral_code },
      });
    }
    if (type === "Full") {
      navigate(`/member-signup`, {
        state: {
          referral_code: referral_code,
          selectedCurrency: currencySelected,
        },
      });
    }
    // }
  };
  return (
    <div
      className={`Membership-cardtheme ${type === "Free" ? "full-membershipcard" : "free-membershipcard"
        }`}
    >
      <div className="card-themeheader"></div>
      <div className="card-content">
        <div className="card-heading">
          {type === "Free" ? (
            <h3 className="customHeading">{freeheading}</h3>
          ) : (
            <h3 className="customHeading">{fullheading}</h3>
          )}
        </div>
        <div className="card-body">
          {type === "Free" ? (
            <div
              className="text-white text-custom"
              dangerouslySetInnerHTML={{ __html: freeFeatures }}
            />
          ) : (
            <div
              className="text-white text-custom"
              dangerouslySetInnerHTML={{ __html: fullFeatures }}
            />
          )}

          <div className="amount-details">
            {type === "Free" ? (
              <div className="free-membership">
                <h4 className="customHeading">FREE</h4>
              </div>
            ) : (
              <>
                <div className="fullmembership-content">
                  {updatedOfferPrice?.full_membership_fee ? (
                    <>
                      <h4 className="customHeading discountAmnt strike-through">
                        <select
                          className="form-select"
                          value={currencySelected}
                          onChange={handleCurrencyChange}
                        >
                          <option value="GBP">£</option>
                          <option value="EUR">€</option>
                          <option value="USD">$</option>
                        </select>
                        {fees.yearly} pa{" "}
                        <span>
                          ({currencySymbols[currencySelected]}
                          {fees.fee} pcm)
                        </span>
                      </h4>
                      <h4 className="customHeading">
                        {currencySymbols[currencySelected]}
                        {updatedOfferPrice?.full_membership_fee} pa{" "}
                        <span>
                          ({currencySymbols[currencySelected]}
                          {updatedOfferPrice?.monthly_membership_fee} pcm)
                        </span>
                      </h4>
                    </>
                  ) : (
                    <h4 className="customHeading discountAmnt">
                      <select
                        className="form-select"
                        value={currencySelected}
                        onChange={handleCurrencyChange}
                      >
                        <option value="GBP">£</option>
                        <option value="EUR">€</option>
                        <option value="USD">$</option>
                      </select>
                      {fees.yearly} pa{" "}
                      <span>
                        ({currencySymbols[currencySelected]}
                        {fees.fee} pcm)
                      </span>
                    </h4>
                  )}
                </div>
                <div className="cancel-time">
                  <span>Cancel any time</span>
                </div>
              </>
            )}
          </div>

          {showButton && (
            <div className="btn-groups">
              <Button
                onClick={handleClick}
                text="Join Now"
                icon={true}
                theme="light"
                className="w-100"
              />
            </div>
          )}
          {type === "Full" && !showButton && (
            <div className="payment-details">
              <p>Secure Payments powered by Stripe</p>
              <div className="payment-card">
                <img
                  src={require("../../assets/images/membersignup/payments.png")}
                  alt="Payment methods"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberShipCard;
