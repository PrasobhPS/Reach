import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Heading } from "../../components/Heading/Heading";
import "../Login/Login.scss";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Button } from "../../components/Button/Button";
import { NavLink } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useState } from "react";
import { useForgotPasswordMutation } from "./ForgotPasswordApiSlice";
interface formValues {
  members_email: string;
}
interface LoginProps {
  onSignInClick: () => void;
  toggleModal: () => void;
}
export const ForgotPassword: React.FC<LoginProps> = ({
  onSignInClick,
  toggleModal,
}) => {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [errorMessage, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const onSubmit = async (data: formValues) => {
    setLoading(true);
    const userData = await forgotPasswordMutation(data);
    // let errorMessage: string = "";
    if ("error" in userData) {
      setLoading(false);
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
      setSuccessMessage("");
    } else {
      setLoading(false);
      setErrorMsg("");
      setSuccessMessage(
        "Password reset link has been sent to your email!"
      );
    }
  };
  return (
    <div className="login-box">
      <div className="login-box-inner">
        <div className="row align-items-center mx-0">
          <div className="col-md-6 col-12 img-box">
            <img src={require("../../assets/images/signup-image.jpg")} alt="" />
          </div>
          {loading ? (
            <div className="page-loader">
              <div className="page-innerLoader">
                <div className="spinner-border" role="status">
                  <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-6 col-12 content-box">
              <Heading tag="h3" className="text-center">
                Reset Password
              </Heading>

              <FormProvider {...form}>
                <form
                  className="login-field"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <CustomInput
                    name="members_email"
                    placeholder="Email Address"
                    type="email"
                    registerConfig={{
                      required: { value: true, message: "Email is required" }, // Specify required as an object with value and message
                    }}
                    className="input-block"
                  />
                  <div className="error">{errorMessage}</div>
                  <div className="success">{successMessage}</div>
                  <Button
                    onClick={() => console.log("Hello")}
                    text="Send mail"
                    icon={true}
                    theme="light"
                    className="w-100"
                  />
                </form>
              </FormProvider>
              <div className="row sub-box">
                <div className="col-12 text-center">
                  <p className="not-a-member">
                    Remember password?
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
          )}
        </div>
      </div>
    </div>
  );
};
