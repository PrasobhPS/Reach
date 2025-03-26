import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import "./MembershipSetup.scss";
import CustomInput from "../../components/CustomInput/CustomInput";
import { FormProvider, useForm } from "react-hook-form";
import { auth, provider } from "../../components/GoogleAuth/GoogleAuth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEmailExistMutation, useLoginMutation } from "../Login/authApiSlice";
import "./Membersignup.scss";
import { setUserData } from "../../utils/Utils";
import { setCredentials } from "../../app/authSlice";
import { useAppDispatch } from "../../Hooks/hooks";

interface FormValues {
    [key: string]: any;
}
interface Signup {
    members_email: string;
}
interface loginData {
    members_email: string;
    google_token: string | undefined;
}
interface FreeSignUpProps {
    referral_code?: string;
}
export const SignWithGoogle: React.FC<FreeSignUpProps> = ({
    referral_code,
}) => {
    const form = useForm<Signup>();
    const { register, control, handleSubmit, formState, watch, setValue } = form;
    const [email, setEmail] = useState('');
    const [memberName, setMemberName] = useState('');
    const [googleToken, setGoogleToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [checkEmail] = useEmailExistMutation();
    const [loginMutation, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const handleFormSubmit = async (data: Signup) => {
        setErrorMessage('');
        try {
            const responseData = await checkEmail(data);
            if ("data" in responseData) {
                setErrorMessage(responseData?.data?.message);
                if (responseData?.data?.success) {
                    navigate(
                        `/member-signup`,
                        {
                            state: {
                                email: data?.members_email,
                                referral_code: referral_code,
                            },
                        }
                    )
                } else {

                }
            }
            if ("error" in responseData) {
                setErrorMessage(responseData?.error?.data?.error);
            }

        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    }
    const handleInputClick = () => {
        setErrorMessage('');
    }

    const loginFunction = async (loginData: loginData) => {
        const userData = await loginMutation(loginData);
        // let errorMessage: string = "";
        if ("error" in userData) {
            console.error("Error logging in:", userData.error);
        } else {
            // console.log(userData, "user");
            setUserData(userData.data.data);
            const users = userData.data.data;
            const { Member_type, Token } = users;
            dispatch(setCredentials({ users, Token }));
            navigate(`/cruz`);
        }
    }
    const handleClick = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const googleToken = credential?.idToken;
            const googleAccessToken = credential?.accessToken;
            const user = result.user;
            setEmail(user.email ?? '');
            setMemberName(user.displayName ?? '');
            setGoogleToken(googleToken ?? '');
            if (user.email) {
                let profileData = {
                    members_email: user.email,
                }
                const responseData = await checkEmail(profileData);
                if ("data" in responseData) {
                    if (responseData?.data?.success) {
                        navigate(
                            `/member-signup`,
                            {
                                state: {
                                    email: user?.email,
                                    memberName: user?.displayName,
                                    googleToken: googleToken,
                                    phoneNumber: user?.phoneNumber,
                                    googleAccessToken: googleAccessToken,
                                    referral_code: referral_code,
                                },
                            }
                        )
                    } else {
                        let loginData = {
                            members_email: user.email,
                            google_token: googleToken
                        }
                        loginFunction(loginData);
                    }
                }


            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    }
    return (
        <div className="signWithgoogle">
            <div className="box-card">
                <FormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        noValidate
                    >
                        <a style={{ cursor: "pointer" }} onClick={handleClick}>
                            <img src={require("../../assets/images/membersignup/google.png")} alt="" className="img-fluid" />
                        </a>
                        <div className="divider">
                            <span className="divider-text">or</span>
                        </div>
                        <div className="Emailform login-field" >
                            <CustomInput
                                name="members_email"
                                placeholder="Email Address"
                                type="text"
                                registerConfig={{
                                    required: {
                                        value: true,
                                        message: "Email Address",
                                    },
                                }}
                                className="input-block"
                                onClick={handleInputClick}
                            />
                            <Button
                                text="Join Now as Free Member"
                                icon={true}
                                className="w-100 bg-white"
                                onClick={() => console.log("Hello")}
                            />
                            <div className="error" style={{ color: "red" }}>{errorMessage}</div>
                        </div>
                        <div className="caption">
                            <p>By continuing, you agree to REACH Terms of Service and Privacy Policy.</p>
                        </div>
                    </form>
                </FormProvider>
            </div>

        </div>
    )
}
export default SignWithGoogle;