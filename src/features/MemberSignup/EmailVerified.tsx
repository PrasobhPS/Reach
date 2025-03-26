import React, { useEffect, useRef, useState } from "react";
import "./Emailverification.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button/Button";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEmailVerifyMutation } from "../Login/authApiSlice";
import { setUserData } from "../../utils/Utils";
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}
export const EmailVerified = () => {
    const appLink = process.env.REACT_APP_LINK_URL;
    const fallbackUrl = process.env.REACT_APP_FALLBACK_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [emailVerify] = useEmailVerifyMutation();

    const [modal, setModal] = useState(false);
    const [isModalOpened, setIsModalOpened] = useState(false);
    useEffect(() => {
        if (window.innerWidth <= 768 && !isModalOpened) {
            setModal(true);
            setIsModalOpened(true); // Mark modal as opened
        }
    }, [isModalOpened]);

     const toggle = () => {
        setModal(false);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [location]);

    const fetchTokenExist = async () => {
        setIsLoading(true);
        const checkData = {
            token: token,
        };
        const userData = await emailVerify(checkData);
        if ("error" in userData) {
            setIsLoading(false);
            Swal.fire({
                title: "Email Already Verified!",
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
            if (userData.data.tokenName === 'authToken_mobile') {
                if (appLink)
                    window.location.href = appLink;

                setTimeout(() => {
                    window.location.href = fallbackUrl || "";
                }, 2000);
            } else {
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            }
            // const newLocalData = userData.data.data;
            // setUserEmail(newLocalData.members_email);
            // setUserData(newLocalData);
        }
    }
    useEffect(() => {
        if (token) {
            fetchTokenExist();
        }
    }, [token]);

    const handleSubmit = () => {
       if (appLink)
        window.location.href = appLink;
    }
    return (
        <div className="EmailVerified-parent verifiedpage">

            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-sm-12">
                        <div className="Email-verifiedPage">
                            <div className="message-iconbox">
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                            <div className="text-content">
                                <h1>Email is Verified!</h1>
                                <div className="content-para">
                                    <span>Your email {userEmail} has been successfully verified. You can now go back to the login page to access the platform.</span>
                                </div>
                                {/* <Button
                                    onClick={() => handleSubmit()}
                                    text="Go to the App"
                                    icon={true}
                                    theme="light"
                                    className="w-100 send-action"
                                /> */}
                                <div className="dont-get">
                                    {/* <a href="#">Don't get e-mail ? <span className="text-pink">Send it again</span></a> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
             <Modal
                isOpen={modal}
                toggle={toggle}
               
                fade={false}
               modalClassName="bottom-modal"
            >
                <ModalHeader toggle={toggle}>
                    <div className="bottom-modalview">
                        <p>view in app</p>
                        <Button
                            onClick={() => handleSubmit()}
                            text="Open"
                            icon={true}
                            theme="dark"
                            className="w-100 open-app"
                        />
                    </div>
                    
                </ModalHeader>
                <ModalBody>
                    <div className="video-player"></div>
                </ModalBody>
            </Modal>
        </div>
    )
}
export default EmailVerified;