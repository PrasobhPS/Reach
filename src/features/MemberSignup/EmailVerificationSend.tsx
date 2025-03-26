import React, { useEffect, useState } from "react";
import "./Emailverification.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useResendEmailVerifyMutation } from "../Login/authApiSlice";
import Swal from "sweetalert2";

export const EmailVerificationSend = () => {
    const navigate = useNavigate();
    const [resendEmailVerify] = useResendEmailVerifyMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const location = useLocation();
    const { email = '', name = '' } = location.state || {};

    useEffect(() => {
        // Show "Send it again" after 5 seconds
        const timer = setTimeout(() => {
            setShowResend(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);

        const checkData = { email };
        const userData = await resendEmailVerify(checkData);
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
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="page-loader">
                    <div className="page-innerLoader">
                        <div className="spinner-border" role="status">
                            <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="EmailVerified-parent">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="Email-verifiedPage">
                                    <div className="message-iconbox">
                                        <FontAwesomeIcon icon={faEnvelopeOpen} />
                                    </div>
                                    <div className="text-content">
                                        <h1>Check Your Inbox Please</h1>
                                        <div className="content-para">
                                            <span>
                                                Hi {name}, to start using Reach, we need to verify your email.
                                                We've already sent out the verification link. Please check it and confirm it's really you.
                                            </span>
                                        </div>
                                        {showResend && (
                                            <div className="dont-get">
                                                <a className="resend">
                                                    Don't get an email?
                                                    <span className="text-pink" onClick={handleSubmit}> Send it again</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmailVerificationSend;
