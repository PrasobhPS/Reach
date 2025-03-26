import React, { useEffect, useRef, useState } from "react";
import "./Membersignup.scss";
import { FormProvider, set, useForm } from "react-hook-form";
import { Button } from "../../components/Button/Button";
import { Heading } from "../../components/Heading/Heading";
import { SignupInterface, initialSignupInterface } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import {
  useMemberSignupMutation,
  useMemberUpdateMutation,
  useRegisterMutation,
  useValidateReferralCodeMutation,
  useReferralDiscountMutation,
  useEmailExistMutation,
  useIosloginMutation,
} from "../Login/authApiSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CountryPicker from "../../components/CountryPicker/CountryPicker";
import { TelephoneField } from "../../components/TelephoneField/TelephoneField";
import { DobPicker } from "../../components/DobPicker/DobPicker";
import { getUserData, setUserData } from "../../utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfileMutation } from "../Profile/profileApiSlice";
import { ProfileData, initialProfileData } from "../../types/ProfileData";
import { FullWindowImageBox } from "../../components/FullWindowImageBox/FullWindowImageBox";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import MemberShipCard from "./MemberShipCard";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import PaymentCard from "./PayementCard";
import Swal from "sweetalert2";

interface LocalData {
  members_profile_picture: string;
  Member_fullname: string;
  Member_type: string;
  Token: string;
  Member_id: string;
  IsEmployer: string;
  IsEmployee: string;
  is_specialist: string;
  currency?: string;
}
interface paymentFee {
  currency: string
  fee: string;
  yearly: string;
}
interface MemberSignFormProps {
  setFunction: (code: MembershipFees | null) => void;
  setRefferal: (code: string) => void;
  currency?: "USD" | "GBP" | "EUR";
  ios_token?: string;
  paymentFee?: paymentFee;
  monthlyFee: number;
  yearlyFee: number;
}
interface MembershipFees {
  full_membership_fee: string;
  monthly_membership_fee: string;
  referal_percentage: string;
}
export const MemberSignForm = ({ setFunction, setRefferal, currency, ios_token, paymentFee, monthlyFee, yearlyFee }: MemberSignFormProps) => {

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const navigate = useNavigate();
  const [signupMutation, { isLoading }] = useMemberSignupMutation();
  const [updateMutation] = useMemberUpdateMutation();
  const [registerMutation, { isLoading: registerLoading }] =
    useRegisterMutation();
  const [profileMutation] = useProfileMutation();
  const [validateReferral] = useValidateReferralCodeMutation();
  const [referralDiscount] = useReferralDiscountMutation();
  const location = useLocation();
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  const form = useForm<SignupInterface>();
  const [stripeToken, setStripeToken] = useState<string>("");
  const [stripeError, setStripeError] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocus, setIsCpasswordFocused] = useState(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const appLink = process.env.REACT_APP_LINK_URL;
  const fallbackUrl = process.env.REACT_APP_FALLBACK_URL;

  const [iosLoginCalled, setIosLoginCalled] = useState(false);
  const [userToken, setUserToken] = useState<string>("");
  const [ios_login] = useIosloginMutation();

  let token = "";
  let memberType = "";

  useEffect(() => {
    const updateData = async () => {
      if (!ios_token || iosLoginCalled) return; // Skip if token is missing or already called

      try {
        setIosLoginCalled(true); // Set the flag before calling to prevent duplicate calls
        const formData = { ios_token };
        const response = await ios_login(formData).unwrap();

        if ("error" in response) {
          console.error("Error logging in:", response.error);
        } else {
          setUserData(response.userData);
          reset(response.data);
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("An error occurred during iOS login:", error);
      }
    };

    updateData();
  }, [ios_token, ios_login, iosLoginCalled]);

  const {
    referral_code = "",
    email = "",
    memberName = "",
    googleToken = "",
    phoneNumber = "",
    googleAccessToken = "",
  } = location.state || {};
  const [firstName = "", lastName = ""] = memberName
    ? memberName.split(" ")
    : ["", ""];
  const { register, control, handleSubmit, formState, reset, watch } = form;
  const { errors, isValid } = formState;
  const [errorMessage, setErrorMsg] = useState("");
  const [isSetLoading, setIsSetLoading] = useState(false);
  const localData: LocalData | null = getUserData("userData");
  const [profileReferral, setProfileReferral] = useState<string>(referral_code);
  const [disableReferral, setDisableReferral] = useState<boolean>(false);
  const [iosPaymentToken, setIosPaymentToken] = useState<string>("");

  if (localData != null) {
    token = localData.Token;
    memberType = localData.Member_type;
  }
  useEffect(() => {
    if (memberType === "M") navigate("/");
    if (token || !email) {
      setValidate(true);
      if (token) {
        fetchData();
      }

      if (email) {
        setDisable(true);
      }
    }
  }, []);
  useEffect(() => {
    if ((email || referral_code) && !token) {
      setSaveButton("Register");
      if (!email) {
        setValidate(true);
      }

      let details = {
        ...initialProfileData,
        referral_code: referral_code,
        google_token: googleAccessToken,
        members_email: email,
        members_fname: firstName,
        members_lname: lastName,
      };
      reset(details);
      setProfileData(details);
    }
    if (email || token) {
      setDisable(true);
    }
  }, [email]);

  const fetchData = async () => {
    try {
      const response = await profileMutation(token);
      if ("error" in response) {
      } else {
        reset(response.data.data);
        setProfileData(response.data.data);
        setProfileReferral(response.data.data.referral_code);
        handleCountryChange(response.data.data.members_country);
      }
    } catch (error) { }
  };
  // let originalDate = "0000-00-00";
  // if (profileData.members_dob) originalDate = profileData.members_dob;
  // const [year, month, day] = originalDate.split("-").map((value) => {
  //   const parsedValue = parseInt(value, 10);
  //   return parsedValue < 10 ? parsedValue.toString() : parsedValue;
  // }) as [number, number, number];

  const onSubmit = async (data: SignupInterface) => {
    // data.members_region = "";
    data.currency = currency;
    data.members_phone_code = data.phone_code;
    // data.members_region = "";
    if (stripeError) {
      setErrorMsg("Please complete the payment to proceed");
      setIsSetLoading(false);
      return false;
    }
    if (stripeToken && stripeToken !== "Error") {
      data.stripeToken = stripeToken;
    }
    if (!acceptTerms) {
      setErrorMsg("Please accept terms and conditions");
      setIsSetLoading(false);
      return false;
    }
    if (stripeToken === "Error") {
      setIsSetLoading(false);
      return false;
    }
    try {
      setIsSetLoading(true);

      let encodedToken = "";
      if (ios_token) {
        const randomToken = Math.random().toString(36).substring(2, 8);
        data.ios_payment_token = randomToken;
        encodedToken = btoa(randomToken);
        setIosPaymentToken(encodedToken);
      }

      let userData;
      let showMessage = false;
      if ((!token && email) || countryError !== "") {
        userData = await registerMutation(data);
      } else {
        userData = await signupMutation(data);
        showMessage = true;
      }
      if ("error" in userData) {
        if (typeof userData.error === "string") {
          setErrorMsg(userData.error);
          // console.error("Error register in:", userData.error);
        } else {
          const fetchError = userData.error as FetchBaseQueryError; // Type assertion
          if (
            fetchError.data &&
            typeof fetchError.data === "object" &&
            "error" in fetchError.data &&
            typeof fetchError.data.error === "string"
          ) {
            setErrorMsg(fetchError.data.error);
            // console.error("Error in:", fetchError.data.error);
          } else {
            setErrorMsg("An error occurred"); // Handle cases where error property doesn't exist
          }
        }
      } else {

        if (showMessage) {
          const newLocalData = userData.data.data;
          if (localData != null) {
            localData.Member_type = newLocalData.Member_type;
            localData.currency = currency;
            setUserData(localData);
          } else setUserData(newLocalData);
          if (ios_token) {
            Swal.fire({
              title: "Payment Done!",
              text: "You have upgraded successfully.",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              backdrop: `
                      rgba(255, 255, 255, 0.5)
                      left top
                      no-repeat
                      filter: blur(5px);
                    `,
              background: "#fff",
            }).then(async (result) => {
              if (result.isConfirmed) {
                //const appLink = `reach://192.168.1.129:3000/${encodedToken}`;
                //const fallbackLink = "https://192.168.1.129:3000";

                window.location.href = appLink + encodedToken;

                setTimeout(() => {
                  window.location.href = fallbackUrl || "";
                }, 2000); // Adjust timeout for user experience
              }
            });
          } else {
            Swal.fire({
              title: "Payment Done!",
              text: "You have registered successfully.",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
              backdrop: `
            rgba(255, 255, 255, 0.5)
            left top
            no-repeat
            filter: blur(5px);
          `,
              background: "#fff",
            });
          }
          navigate("/");

        } else {
          navigate('/emailVerificationSend', {
            state: {
              email: data.members_email,
              name: data.members_fname,
            },
          }
          );
        }

        //navigate("/");
      }
    } catch (error) {
      setErrorMsg("An error occurred during submission");
    } finally {
      setIsSetLoading(false);
    }
  };
  const password = watch("members_password");
  const validatePasswordMatch = (value: string) => {
    return value === password || "Passwords do not match";
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const passwordPattern = /^(?=.*\d)[A-Za-z\d\W]{8,}$/;

  const options = [
    { value: "Annual", label: "Annual Subscription" },
    { value: "Monthly", label: "Monthly Subscription" },
  ];

  const [saveButton, setSaveButton] = useState<string>("Pay Securely Now");
  const [validate, setValidate] = useState<boolean>(false);

  const stripeTokenHandler = async (Token: any) => {
    if (Token === "Error") {
      setIsSetLoading(false);
      setStripeError(true);
      if (token) {
        handleSubmit(onSubmit)();
      }
    } else {
      if (Token) {
        setStripeToken(Token);
        setStripeError(false);
        setIsSetLoading(false);
        handleSubmit(onSubmit)();
      } else {
        setIsSetLoading(false);
        setStripeError(true);

      }
      handleSubmit(onSubmit)();
    }
    if (!token && Token === "Error") {
      // setIsSetLoading(false);
      handleSubmit(onSubmit)();
    }
  };
  useEffect(() => {
    if (profileReferral && currency) {
      checkReferral();
      if (token) {
        setDisableReferral(true);
      }
    }
  }, [profileReferral, currency]);
  const [referral_msg, setReferralMsg] = useState<string>("");
  const [successClass, setSuccessClass] = useState<string>("");
  const [offerPrice, setOfferPrice] = useState<MembershipFees | null>(null);

  const checkReferral = async (
    event?: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const enteredValue = event ? event.target.value : profileReferral;

    if (enteredValue) {
      try {
        const formData = {
          referral_code: enteredValue,
          currency: currency,
        };
        const response = await validateReferral(formData).unwrap();
        if (response.success) {
          const responseOther = await referralDiscount(formData).unwrap();
          if (responseOther.success) {
            setSuccessClass("success");
            setReferralMsg(
              `${responseOther.data?.referal_percentage
                ? parseInt(responseOther.data?.referal_percentage)
                : ""
              } % referral discount applied successfully.`
            );
            setRefferal(enteredValue);
            setOfferPrice(responseOther.data);
            setFunction(responseOther.data);
          }
        } else {
          setReferralMsg(response.data.message);
        }
      } catch (error) {
        if (error && typeof error === "object" && "data" in error) {
          const typedError = error as { data: any }; // Casting 'error' to the expected shape
          setReferralMsg(typedError.data.message);
          setSuccessClass("error");
          setOfferPrice(null);
          setFunction(null);
        }
      }
    } else {
      setSuccessClass("");
      setReferralMsg("");
      setOfferPrice(null);
      setFunction(null);
    }
  };

  const [checkEmail] = useEmailExistMutation();
  const [errorMsg, setErrorMessage] = useState("");
  const checkEmailExist = async (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const enteredValue = event.target.value;
    if (enteredValue && !token) {
      try {
        let profileData = {
          members_email: enteredValue,
        };
        const responseData = await checkEmail(profileData);
        if ("data" in responseData) {
          if (responseData.data.success) {
            setErrorMessage("");
          } else {
            setErrorMessage(responseData?.data?.message);
          }
        }
      } catch (error) {
        console.log(error, "ERROR RESPONSE");
      }
    } else {
      setErrorMessage("");
    }
  };
  const [countryError, setCountryError] = useState<string>('');
  const handleCountryChange = async (country: { name: string; iso: string }) => {
    if (country.name === 'United States') {
      setStripeToken('');
      setCountryError('Currently the full membership option is not available for American residents');
      Swal.fire({
        title: "",
        text: "Currently the full membership option is not available for American residents",
        icon: "warning",
        showConfirmButton: true,
        backdrop: `
        rgba(255, 255, 255, 0.5)
        left top
        no-repeat
        filter: blur(5px);
      `,
        background: "#fff",
      });
    } else {
      setCountryError("");
    }
    if (country.iso) {
      setCountryCode(country.iso);
    }
  }
  const handleChange = async (select: string) => {
    if (select == 'Monthly') {
      if (paymentFee?.fee) {
        setAmount(parseFloat(paymentFee?.fee));
      }
    } else {
      if (paymentFee?.yearly) {
        setAmount(parseFloat(paymentFee?.yearly));
      }
    }

  }
  useEffect(() => {
    if (stripeToken) {
      handleSubmit(onSubmit)(); // Call handleSubmit only when stripeToken is set
    }
  }, [stripeToken]);
  const [amount, setAmount] = useState<number>(yearlyFee);
  const [currencysymb, setCurrencysymb] = useState<string>(currencySymbols[paymentFee?.currency || 'GBP']);
  const [countryCode, setCountryCode] = useState<string>('GB');
  useEffect(() => {
    if (paymentFee?.yearly) {
      setAmount(parseFloat(paymentFee?.yearly));
    }
    if (paymentFee?.currency) {
      setCurrencysymb(currencySymbols[paymentFee?.currency]);
    }
  }, [paymentFee]);

  const handleAccept = async () => {
    setAcceptTerms(!acceptTerms)
  }

  return (
    <div className="content-box-details">
      <Heading tag="h4">Your details</Heading>
      {isSetLoading ? (
        <div className="page-loader">
          <div className="page-innerLoader">
            <div className="spinner-border" role="status">
              <img
                src={require("../../assets/images/cruz/Frame.png")}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <FormProvider {...form}>
        <form
          className="login-field"
          id="register-form"
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {googleAccessToken ? (
            <CustomInput
              name="google_token"
              placeholder="Google Token"
              type="hidden"
              registerConfig={{
                required: { value: false, message: "Email is required" },
              }}
              className="input-block"
            />
          ) : (
            ""
          )}
          <div
            className={`member-emails ${errorMsg !== "" ? "error-active" : ""}`}
          >
            <CustomInput
              name="members_email"
              placeholder="Email Address"
              type="email"
              disable={disable}
              registerConfig={{
                required: { value: true, message: "Email is required" },
              }}
              className="input-block"
              onBlur={(event) => checkEmailExist(event)}
            />
            {errorMsg !== "" && <div className="error">{errorMsg}</div>}
          </div>

          <div className="row">
            <div className="col-md-2">
              <CustomInput
                name="members_name_title"
                placeholder="Title"
                type="text"
                registerConfig={{
                  required: {
                    value: true,
                    message: "Title is required",
                  },
                }}
                className="input-block"
              />
            </div>
            <div className="col-md-5">
              <CustomInput
                name="members_fname"
                placeholder="First Name"
                type="text"
                registerConfig={{
                  required: {
                    value: true,
                    message: "First Name is required",
                  },
                }}
                className="input-block"
              />
            </div>
            <div className="col-md-5">
              <CustomInput
                name="members_lname"
                placeholder="Surname"
                type="text"
                registerConfig={{
                  required: {
                    value: true,
                    message: "Last Name is required",
                  },
                }}
                className="input-block"
              />
            </div>
          </div>
          <TelephoneField
            name="members_phone"
            registerConfig={{
              required: {
                value: validate,
                message: "Phone number is required",
              },
            }}
            initialValue={
              profileData.members_phone_code
                ? profileData.members_phone_code
                : "225"
            }
          />

          <CustomInput
            name="members_address"
            placeholder="Address"
            type="text"
            registerConfig={{
              required: {
                value: validate,
                message: "Address is required",
              },
            }}
            className="input-block"
          />
          <CustomInput
            name="members_town"
            placeholder="Town"
            type="text"
            registerConfig={{
              required: { value: validate, message: "Town is required" },
            }}
            className="input-block"
          />

          <CustomInput
            name="members_region"
            placeholder="Region / County"
            type="text"
            registerConfig={{
              required: {
                value: validate,
                message: "Region is required",
              },
            }}
            className="input-block"
          />
          <CustomInput
            name="members_postcode"
            placeholder="Postcode"
            type="text"
            registerConfig={{
              required: {
                value: validate,
                message: "Postcode is required",
              },
              minLength: {
                value: 5, // Minimum length for postcode
                message: "Postcode must be at least 5 characters long",
              },
              maxLength: {
                value: 10, // Maximum length for postcode
                message: "Postcode cannot be more than 10 characters long",
              },
            }}
            className="input-block"
          />
          <div
            className={`CountryPicker ${countryError !== "" ? "error-Occured" : "CountryPicker-section"
              }`}
          >
            <CountryPicker
              name="members_country"
              registerConfig={{
                required: {
                  value: validate,
                  message: "Country is required",
                },
              }}
              handleChange={handleCountryChange}
            />
            {countryError !== "" && (
              <div className="error CountryPicker-error">{countryError}</div>
            )}
          </div>
          {!token ? (
            <div>
              <div
                className={`password-area ${isFocused ? "focused" : ""}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              >
                <CustomInput
                  name="members_password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  registerConfig={{
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    pattern: {
                      value: passwordPattern,
                      message:
                        "Password must be at least 8 characters long and should include one number.",
                    },
                  }}
                  className="input-block"
                />
                <div
                  className="icon"
                  onClick={() => setShowPassword((preValue) => !preValue)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </div>
              </div>
              <div
                className={`password-area ${isFocus ? "ConfirmPasswordfocused" : ""
                  }`}
                onFocus={() => setIsCpasswordFocused(true)}
                onBlur={() => setIsCpasswordFocused(false)}
              >
                <CustomInput
                  name="members_password_confirmation"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  registerConfig={{
                    required: {
                      value: true,
                      message: "Confirm Password is required",
                    },
                    validate: validatePasswordMatch,
                  }}
                  className="input-block"
                />
                <div
                  className="icon"
                  onClick={() =>
                    setShowConfirmPassword((preValue) => !preValue)
                  }
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="row">
            <CustomInput
              name="referral_code"
              placeholder="Do you have a Referral Code"
              type="text"
              disable={disableReferral}
              registerConfig={{
                required: { value: false, message: "" },
              }}
              className="input-block"
              onBlur={(event) => checkReferral(event)}
            />
            {referral_msg !== "" && (
              <div className={successClass}>{referral_msg}</div>
            )}
          </div>
          {currency ? (
            <CustomInput
              name="currency"
              type="hidden"
              registerConfig={{
                required: { value: false, message: "Email is required" },
              }}
              className="input-block"
            />
          ) : (
            ""
          )}

          {email || (countryError !== "" && memberType !== "F") ? (
            <div>
              <div className="sub-box">
                <div className="col keep-logged">
                  <input type="checkbox" id="keeplogged" onChange={handleAccept} />
                  <label htmlFor="keeplogged">
                    Accept our{" "}
                    <a
                      href="https://reach.boats/legal"
                      className="text-pink"
                      target="_blank"
                    >
                      Terms and conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="error">{errorMessage}</div>
              <Button
                disabled={isLoading}
                onClick={() => {
                  !acceptTerms
                    ? setErrorMsg("Please accept terms and conditions")
                    : setErrorMsg("");
                  isValid && setIsSetLoading(true);
                }}
                text={isLoading ? "Please wait..." : saveButton}
                icon={true}
                theme="light"
                className="w-100"
              />
            </div>
          ) : (
            ""
          )}
        </form>

        {!email && countryError === "" ? (
          <div className="mt-3">
            <div className="col-md-12 col-12 AnnualSubscription">
              <CustomSelect
                name="subscription_plan"
                placeholder="Subscription Plan"
                options={options}
                registerConfig={{
                  required: {
                    value: true,
                    message: "Subscription plan is required",
                  },
                }}
                handleChange={handleChange}
              />
            </div>
            <PaymentCard stripeTokenHandler={stripeTokenHandler} currency={currencysymb} amount={amount} country={countryCode} isValid={isValid} />
            <div className="sub-box">

              <div className="col keep-logged">

                <input
                  type="checkbox"
                  id="keeploggednew"
                  onChange={handleAccept}
                />
                <label htmlFor="keeploggednew">
                  Accept our{" "}
                  <a
                    href="https://reach.boats/legal"
                    className="text-pink"
                    target="_blank"
                  >
                    Terms and conditions
                  </a>
                </label>
              </div>
            </div>
            <div className="error">{errorMessage}</div>
            <Button
              disabled={isLoading}
              onClick={() => {
                !acceptTerms
                  ? setErrorMsg("Please accept terms and conditions")
                  : setErrorMsg("");
                isValid && setIsSetLoading(true);
                stripeTokenHandler(stripeToken);
              }}
              text={isLoading ? "Please wait..." : saveButton}
              icon={true}
              form="checkout-form"
              theme="light"
              className="w-100"
            />
          </div>
        ) : (
          ""
        )}
      </FormProvider>
    </div>
  );
};

export default MemberSignForm;
