import { FormProvider, useForm } from "react-hook-form";
import { Heading } from "../../components/Heading/Heading";
import "../Login/Login.scss";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Button } from "../../components/Button/Button";
import { NavLink } from "react-router-dom";
import { useRegisterMutation } from "../Login/authApiSlice";
import { setUserData } from "../../utils/Utils";
import { SignupInterface, initialSignupInterface } from "../../types";
import { DobPicker } from "../../components/DobPicker/DobPicker";
import CountryPicker from "../../components/CountryPicker/CountryPicker";
import { TelephoneField } from "../../components/TelephoneField/TelephoneField";
import { useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
interface LoginProps {
  onSignInClick: () => void;
  toggleModal: () => void;
}

export const Register: React.FC<LoginProps> = ({
  onSignInClick,
  toggleModal,
}) => {
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [isFocused, setIsFocused] = useState(false);
  const [isFocus, setIsCpasswordFocused] = useState(false);
  const form = useForm<SignupInterface>({
    defaultValues: initialSignupInterface,
  });
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const [errorMessage, setErrorMsg] = useState("");
  const onSubmit = async (data: SignupInterface) => {
    // const yearStr = data.dobYear.toString();
    // const monthStr =
    //   parseInt(data.dobMonth) < 10
    //     ? "0" + parseInt(data.dobMonth).toString()
    //     : parseInt(data.dobMonth).toString();
    // const dayStr =
    //   parseInt(data.dobDay) < 10
    //     ? "0" + parseInt(data.dobDay).toString()
    //     : parseInt(data.dobDay).toString();

    // data.members_dob = yearStr + "-" + monthStr + "-" + dayStr;
    const { dobDay, dobMonth, dobYear } = data.members_dob_data;
    const dob = `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(
      dobDay
    ).padStart(2, "0")}`;
    data.members_dob = dob;
    data.members_phone_code = data.phone_code;
    // data.members_country = country;

    const userData = await registerMutation(data);
    if ("error" in userData) {
      console.error("Error logging in:", userData.error);
      if (typeof userData.error === "string") {
        setErrorMsg(userData.error); // Assign the error message if it's already a string
      } else {
        const fetchError = userData.error as FetchBaseQueryError; // Type assertion
        if (
          fetchError.data &&
          typeof fetchError.data === "object" &&
          "error" in fetchError.data &&
          typeof fetchError.data.error === "string"
        ) {
          setErrorMsg(fetchError.data.error);
        } else {
          setErrorMsg("An error occurred"); // Handle cases where error property doesn't exist
        }
      }
    } else {
      setUserData(userData.data.data);
      toggleModal();
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const passwordPattern = /^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return (
    <div className="login-box">
      <div className="login-box-inner">
        <div className="row mx-0">
          <div className="col-md-6 col-12 img-box register-imagesection">
            <img src={require("../../assets/images/signup-image.jpg")} alt="" />
          </div>
          <div className="col-md-6 col-12 content-box register-contentbox">
            <Heading tag="h3" className="text-center">
              Sign Up
            </Heading>
            <div className="register-formaction">
              <FormProvider {...form}>
                <form
                  className="login-field"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
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
                  <CustomInput
                    name="members_email"
                    placeholder="Email Address"
                    type="email"
                    registerConfig={{
                      required: { value: true, message: "Email is required" },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    }}
                    className="input-block"
                  />
                  <div className="row">
                    <div className="col-md-12">
                      <TelephoneField
                        name="members_phone"
                        registerConfig={{
                          required: { value: false, message: "Phone is required" },
                        }}
                        initialValue="225"
                      />
                    </div>
                  </div>
                  <CustomInput
                    name="members_address"
                    placeholder="Address"
                    type="text"
                    registerConfig={{
                      required: { value: false, message: "Address is required" },
                    }}
                    className="input-block"
                  />
                  <CustomInput
                    name="members_town"
                    placeholder="Town"
                    type="text"
                    registerConfig={{
                      required: { value: false, message: "Town is required" },
                    }}
                    className="input-block"
                  />
                  <CustomInput
                    name="members_street"
                    placeholder="Street"
                    type="text"
                    registerConfig={{
                      required: { value: false, message: "Street is required" },
                    }}
                    className="input-block"
                  />
                  <CountryPicker
                    name="members_country"
                    registerConfig={{
                      required: { value: false, message: "Country is required" },
                    }}
                  />
                  <CustomInput
                    name="members_region"
                    placeholder="Region"
                    type="text"
                    registerConfig={{
                      required: { value: false, message: "Region is required" },
                    }}
                    className="input-block"
                  />
                  <CustomInput
                    name="members_postcode"
                    placeholder="Postcode"
                    type="text"
                    registerConfig={{
                      required: { value: false, message: "Postcode is required" },
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
                  <div className="dobpicker-contents">
                    <div className="row w-100 mx-0">
                      <div className="col-md-3 col-sm-12 px-0">
                        <label>Date of Birth</label>
                      </div>
                      <div className="col-md-9 col-sm-12 px-0">
                        <DobPicker
                          name="members_dob_data"
                          registerConfig={{
                            required: { value: false, message: "is required" },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`password-area ${isFocused ? 'focused' : ''}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  >
                    <CustomInput
                      name="members_password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      registerConfig={{
                        required: { value: true, message: "Password is required" },
                        pattern: {
                          value: passwordPattern,
                          message: "Password must be at least 8 characters long and should include one number.",
                        },
                      }}
                      className="input-block"
                    />
                    <div className="icon" onClick={() => setShowPassword(preValue => !preValue)}>
                      <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </div>
                  </div>
                  <div className={`password-area ${isFocus ? 'ConfirmPasswordfocused' : ''}`}
                    onFocus={() => setIsCpasswordFocused(true)}
                    onBlur={() => setIsCpasswordFocused(false)}
                  >
                    <CustomInput
                      name="members_password_confirmation"
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      registerConfig={{
                        required: { value: true, message: "Confirm Password is required" },
                        validate: (val: string) => {
                          if (watch("members_password") != val) {
                            return "Passwords do not match";
                          }
                        },
                      }}
                      className="input-block"
                    />
                    <div className="icon" onClick={() => setShowConfirmPassword(preValue => !preValue)}>
                      <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                    </div>
                  </div>
                  <div className="pt-1">
                    <CustomInput
                      name="referral_code"
                      placeholder="Referral code"
                      type="text"
                      registerConfig={{
                        required: { value: false, message: "referral code is required" },
                      }}
                      className="input-block"
                    />
                  </div>
                  <div className="error">{errorMessage}</div>
                  <Button
                    onClick={() => console.log("Hello")}
                    text="Sign up"
                    icon={true}
                    theme="light"
                    className="w-100"
                  />
                </form>
              </FormProvider>
              <div className="row sub-box">
                <div className="col-12 text-center">
                  <p className="not-a-member">
                    Already a member?
                    <NavLink
                      to="#"
                      onClick={onSignInClick}
                      className="sign-uptag"
                    >
                      Sign In
                    </NavLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
