import { FormProvider, useForm } from "react-hook-form";
import { Heading } from "../../components/Heading/Heading";
import "./Login.scss";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Button } from "../../components/Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { useEmailExistMutation, useLoginMutation } from "./authApiSlice";
import { setUserData } from "../../utils/Utils";
import { useAppDispatch } from "../../Hooks/hooks";
import {
  faFacebookF,
  faGoogle,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useState } from "react";
import { setCredentials } from "../../app/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { auth, provider } from "../../components/GoogleAuth/GoogleAuth";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { signInWithFacebook } from "../../components/GoogleAuth/FacebookAuth";
import { useResendEmailVerifyMutation } from "./authApiSlice";
import Swal from "sweetalert2";
interface formValues {
  members_email: string;
  members_password: string;
}
interface googleData {
  members_email: string;
  google_token: string | undefined;
}
interface LoginProps {
  onSignUpClick: () => void;
  onForgotClick: () => void;
  toggleModal: () => void;
}
declare global {
  interface Window {
    dataLayer: any[];
  }
}
export const Login: React.FC<LoginProps> = ({
  onSignUpClick,
  onForgotClick,
  toggleModal,
}) => {
  const dispatch = useAppDispatch();
  const [isLoad, setIsLoading] = useState(true);
  const [loginMutation, { isLoading }] = useLoginMutation();
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [errorMessage, setErrorMsg] = useState<string | React.ReactNode>("");

  const [isFocused, setIsFocused] = useState(false);
  // const [loginMutation] = useLoginMutation();
  const Loading = () => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
  const onSubmit = async (data: formValues) => {
    loginFunction(data);
  };

  const [resendEmailVerify] = useResendEmailVerifyMutation();
  const [sendEmail, setSendEmail] = useState<string>('');
  const handleSendAgain = async () => {

    setIsLoading(true);
    console.log('sendEmail----', sendEmail);
    const checkData = { email: sendEmail };
    console.log('checkData', checkData);
    const userData = await resendEmailVerify(checkData);
    console.log('userData-----', userData);
    setIsLoading(false);

    if ("error" in userData) {
      Swal.fire({
        title: "Already Verified!",
        icon: "warning",
        timer: 3000,
        showConfirmButton: false,
        backdrop: `rgba(255, 255, 255, 0.5) left top no-repeat filter: blur(5px);`,
        background: '#fff',
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      toggleModal();
      navigate('/emailVerificationSend', {
        state: {
          email: userData.data.email,
          name: userData.data.name,
        },
      }
      );
    }
  }

  const navigate = useNavigate();
  const [checkEmail] = useEmailExistMutation();
  type loginData = formValues | googleData;
  const loginFunction = async (data: loginData) => {
    setSendEmail(data.members_email);
    const userData = await loginMutation(data);
    // let errorMessage: string = "";
    if ("error" in userData) {
      Loading();
      console.error("Error logging in:", userData.error);
      if (typeof userData.error === "string") {
        setErrorMsg(userData.error); // Assign the error message if it's already a string
      } else {
        const fetchError = userData.error as FetchBaseQueryError; // Type assertion
        console.log('fetchError---', fetchError?.data);
        if (
          fetchError.data &&
          typeof fetchError.data === "object" &&
          "error" in fetchError.data &&
          typeof fetchError.data.error === "string"
        ) {
          setErrorMsg(fetchError.data.error);
        } else if (
          fetchError.data &&
          typeof fetchError.data === "object" &&
          "message" in fetchError.data &&
          typeof fetchError.data.message === "string"
        ) {

          setErrorMsg(fetchError.data.message);
        } else {
          setErrorMsg("An error occurred");
        }


      }
    } else {


      // console.log(userData, "user");
      setErrorMsg("");
      setUserData(userData.data.data);
      const users = userData.data.data;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "user_login",
        userId: users.Member_id, // Replace with dynamic user ID
      });
      Loading();
      toggleModal();
      const { Member_type, Token } = users;
      dispatch(setCredentials({ users, Token }));
      // window.location.reload();
    }
  }

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleToken = credential?.idToken;
      const googleAccessToken = credential?.accessToken;
      const user = result.user;
      if (user.email) {
        let profileData = {
          members_email: user.email,
        }
        const responseData = await checkEmail(profileData);
        if ("data" in responseData) {
          if (responseData?.data?.success) {
            toggleModal();
            navigate(
              `/member-signup`,
              {
                state: {
                  email: user?.email,
                  memberName: user?.displayName,
                  googleToken: googleToken,
                  phoneNumber: user?.phoneNumber,
                  googleAccessToken: googleAccessToken,
                },
              }
            )
          } else {
            let loginData = {
              members_email: user.email,
              google_token: googleAccessToken
            }
            loginFunction(loginData);
          }
        }


      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }
  const removeError = () => {
    setErrorMsg("");
  }

  const handleFacebook = async () => {
    try {
      const result = await signInWithFacebook();
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="login-box">
      <div className="login-box-inner">
        <div className="row align-items-center mx-0">
          <div className="col-md-6 col-12 img-box">
            <img src={require("../../assets/images/signup-image.jpg")} alt="" />
          </div>
          <div className="col-md-6 col-12 content-box">

            <FormProvider {...form}>
              <Heading tag="h3" className="text-center">
                LOGIN
              </Heading>
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
                  onFocus={removeError}
                />
                <div className={`password-area ${isFocused ? 'focused' : ''}`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                >
                  <CustomInput
                    name="members_password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    registerConfig={{
                      required: { value: true, message: "Password is required" }, // Specify required as an object with value and message
                    }}
                    className="input-block"
                    onFocus={removeError}
                  />
                  <div className="icon" onClick={() => setShowPassword(preValue => !preValue)}>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </div>
                </div>
                <div className="error">
                  {errorMessage === "Unauthorized" ? (
                    "Invalid Username or Password"
                  ) : errorMessage === "Please verify your email account." ? (
                    <>
                      <span style={{ display: "flex" }}>
                        {errorMessage}
                      </span>
                      <span style={{ color: "#fff" }}>
                        Didn't get an email?

                        <span className="text-pink" style={{ cursor: "pointer" }} onClick={handleSendAgain}> Send it again</span>
                      </span>
                    </>
                  ) : (
                    errorMessage
                  )}
                </div>

                <Button
                  onClick={() => console.log("Hello")}
                  text="Login"
                  icon={true}
                  theme="light"
                  className="w-100 btn-sign"
                />
              </form>
            </FormProvider>
            <div className="row sub-box">
              <div className="col keep-logged">
                <input type="checkbox" id="keeplogged" />
                <label htmlFor="keeplogged">Keep me logged in</label>
              </div>
              <div className="col text-end">
                <NavLink to="#" onClick={onForgotClick} className="forgot-link">
                  Forgot your password?
                </NavLink>
              </div>
              <div className="logged-with">
                <label className="logged-withlabel">Or sign in with</label>
                <div className="nav-action-link justify-content-start">
                  <Button
                    onClick={handleGoogle}
                    text="Google"
                    icon={true}
                    theme="light"
                    iconname={faGoogle}
                    className="button-reverse w-100 mx-2"
                  />
                  <Button
                    onClick={handleFacebook}
                    text="Facebook"
                    icon={true}
                    theme="light"
                    iconname={faFacebookF}
                    className="button-reverse w-100"
                  />
                  {/* <Button
                    onClick={() => console.log("Hello")}
                    text="Apple"
                    icon={true}
                    theme="light"
                    iconname={faApple}
                    className="button-reverse w-100"
                  /> */}
                </div>
              </div>
              <div className="col-12 text-center">
                <p className="not-a-member">
                  Not a member yet?
                  <Button
                    icon={true}
                    text="Join"
                    onClick={onSignUpClick}
                    className="sign-uptag"
                  >
                  </Button>
                </p>
              </div>
            </div>
            {isLoading && (
              <div className="page-loader">
                <div className="page-innerLoader">
                  <div className="spinner-border" role="status">
                    <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
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
