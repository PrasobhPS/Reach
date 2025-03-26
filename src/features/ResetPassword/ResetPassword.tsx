import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Heading } from "../../components/Heading/Heading";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../components/Button/Button";
import CustomInput from "../../components/CustomInput/CustomInput";
import "./ResetPassword.scss";
import { useResetPasswordMutation, useCheckTokenExistsMutation } from "./ResetPasswordApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import Swal from "sweetalert2";
interface formValues {
  members_email: string;
  new_password: string;
  new_password_confirmation: string;
  token: string | null;
}

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const passwordPattern = /^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const [isFocused, setIsFocused] = useState(false);
  const [isFocus, setIsCpasswordFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location]);
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;
  const [errorMessage, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [checkTokenExists] = useCheckTokenExistsMutation();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchTokenExist = async () => {
    setIsLoading(true);
    const checkData = {
      token: token,
    };
    const tokenData = await checkTokenExists(checkData);
    if ("error" in tokenData) {
      setIsLoading(false);
      Swal.fire({
        title: "Token Expired!",
        text: '',
        icon: "warning",
        timer: 3000,
        showConfirmButton: false,
        backdrop: `
      rgba(255, 255, 255, 0.5)
      left top
      no-repeat
      filter: blur(5px);
    `,
        background: '#fff',
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (token) {
      fetchTokenExist();
    }
  }, [token]);

  const onSubmit = async (data: formValues) => {
    data.token = token;
    setIsLoading(true);
    const userData = await resetPasswordMutation(data);
    // let errorMessage: string = "";
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
      setSuccessMessage("");
      setIsLoading(false);
    } else {
      setErrorMsg("");

      setShouldNavigate(true);
      setIsLoading(false);
      Swal.fire({
        title: "Password Reset!",
        text: 'Your password has been changed successfully. Use your new password to sign in.',
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        backdrop: `
      rgba(255, 255, 255, 0.5)
      left top
      no-repeat
      filter: blur(5px);
    `,
        background: '#fff',
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <div className="reset-password">

      <Heading>Reset Password</Heading>
      <p className="text-para">Reset your password</p>
      <div className="content-box">
        <FormProvider {...form}>
          <form
            className="login-field"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >

            <div className={`password-area position-relative ${isFocused ? 'focused' : ''}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <CustomInput
                name="new_password"
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                registerConfig={{
                  required: {
                    value: true,
                    message: "New password is required",
                  },
                }}
                className="input-block"
              />
              <div className="icon" onClick={() => setShowPassword(preValue => !preValue)}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </div>
            </div>
            <div className={`password-area position-relative ${isFocus ? 'ConfirmPasswordfocused' : ''}`}
              onFocus={() => setIsCpasswordFocused(true)}
              onBlur={() => setIsCpasswordFocused(false)}
            >
              <CustomInput
                name="new_password_confirmation"
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                registerConfig={{
                  required: {
                    value: true,
                    message: "Confirm password is required",
                  },
                  validate: (val: string) => {
                    if (watch("new_password") != val) {
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

            <div className="error">{errorMessage}</div>
            {isLoading ? (
              <div>

                <div className="page-loader">
                  <div className="page-innerLoader">
                    <div className="spinner-border" role="status">
                      <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <Button
              onClick={() => console.log("Hello")}
              text="Update Password"
              icon={true}
              theme="light"
              className="w-100"
            />
          </form>
        </FormProvider>
      </div>

    </div>
  );
};
