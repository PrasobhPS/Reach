import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { EmployerProfile } from "../../components/EmployerProfile/EmployerProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody } from "reactstrap";
import { useState, useEffect } from "react";
import { Button } from "../../../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useEmployerProfileQuery } from "../../components/EmployerProfile/EmployerProfileApiSlice";
import { useAvailableJobsListMutation, useLikeEmployeeMutation, useUnlikeEmployeeMutation } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import SingleChatMain from "../../../Chat/PrivateChat/SingleChatMain/SingleChatMain";
import { EmployeeInterface, MemberInterface } from "../../../../types/PrivateChatInterfaces";
import { getUserData } from "../../../../utils/Utils";
import { useSocket } from "../../../../contexts/SocketContext";

interface Media {
    id: number;
    media_file: string;
}
interface EmpDetails {
    employee_id: number;
    job_ids: number[];
    jobCount: number;
}

export const EmployerViewsJobs = () => {
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const [modalCall, setModalCall] = useState(true);
    const [jobProfile, setJobProfile] = useState(null);
    const [medias, setMedias] = useState<Media[]>([]);
    const location = useLocation();
    const [page, setPage] = useState(1);
    const [pageDetails, setPageDetails] = useState('');
    const [jobId, setJobId] = useState(null);
    const [empDetails, setEmpDetails] = useState<EmpDetails>(location.state as EmpDetails);
    const [availableJobs] = useAvailableJobsListMutation();
    const [loading, setLoading] = useState(false);
    const [likeEmployee] = useLikeEmployeeMutation();
    const [unLikeEmployee] = useUnlikeEmployeeMutation();
    const [profilePic, setProfilePic] = useState();
    const userData = getUserData("userData");
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const [isMatch, setIsmMatch] = useState<boolean>(false);
    let memberProfilePic = "";
    const { setIsChatVisible, setPrivateChatMember, setIsInterview, setEmployeeDetails, setChatType } = useSocket();

    try {
        if (userData !== null) {
            memberProfilePic = userData.members_profile_picture;
        } else {
            // console.error("User data not found in local storage");
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }
    const Loading = () => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }
    useEffect(() => {
        const fetchAvailableJobs = async () => {
            if (empDetails.employee_id && empDetails.job_ids) {
                let jobData = {
                    employee_id: empDetails.employee_id,
                    job_ids: empDetails.job_ids,
                    page: page,
                };
                setLoading(true);
                try {
                    const response = await availableJobs(jobData);
                    if ('data' in response && response.data) {
                        setJobProfile(response.data.data[0]);
                        setMedias(response.data.data[0].job_images);
                        setJobId(response.data.data[0].id);
                        if (response.data.data[0].is_match === 'Y') {
                            setIsmMatch(true);

                            setProfilePic(response.data.data[0].member.member_profile_picture);
                            setIsInterview(false);
                            setChatType('CRUZ');
                            setPrivateChatMember(response.data.data[0].member);
                            setIsChatVisible(true);
                            setEmployeeDetails({
                                employee_id: empDetails.employee_id,
                                job_id: response.data.data[0].id
                            });
                            const timer = setTimeout(() => {
                                toggleModal2();
                            }, 800);

                        }
                    }
                } catch (error) {
                    console.error("Error fetching available jobs:", error);
                } finally {
                    Loading();
                }
            }
        };

        fetchAvailableJobs();
        setPageDetails(`Viewing ${page} of ${empDetails.jobCount} matching jobs`);
    }, [empDetails, page, availableJobs]);

    const [Status, setStatus] = useState(0);
    const [className, setClassName] = useState('');
    const navigate = useNavigate();
    const toggleModal1 = () => {
        setModal1Open(!modal1Open);
    }
    const toggleModal2 = () => {
        setModal2Open(!modal2Open);
    };
    const handleNext = async () => {
        if (page < empDetails.jobCount) {
            setPage(prevPage => prevPage + 1);
        } else {
            setPageDetails('No more Jobs to show');
            const timer = setTimeout(() => {
                navigate('/cruz/employeedashboard');
            }, 700);

        }
    }
    const handleBack = async () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        } else {
            navigate(-1);
        }
    }
    const handleLike = async () => {
        try {
            //setLoading(true);
            let profileData = {
                employee_id: empDetails.employee_id,
                job_id: jobId,
            }
            const response = await likeEmployee(profileData);
            if ('data' in response && response.data) {
                if (response.data.is_match === 'Y') {
                    setProfilePic(response.data.data.member_profile_picture);
                    setIsInterview(false);
                    setChatType('CRUZ');
                    setPrivateChatMember(response.data.data);
                    setIsChatVisible(true);
                    if (profileData.employee_id && profileData.job_id) {
                        setEmployeeDetails({
                            employee_id: profileData.employee_id,
                            job_id: profileData.job_id
                        });
                    }
                    toggleModal2();
                } else {
                    if (modalCall === true) {
                        toggleModal1();
                    }
                    setModalCall(false);
                    if (page - 1 < empDetails.jobCount) {
                        handleNext();
                    } else {
                        handleBack();
                    }
                }

            }
        } catch (error) {
            console.error("Error fetching available jobs:", error);
        } finally {
            setLoading(false);
        }
    }
    const handleDisLike = async () => {
        try {
            //setLoading(true);
            let profileData = {
                employee_id: empDetails.employee_id,
                job_id: jobId,
            }
            const response = await unLikeEmployee(profileData);
            if ('data' in response && response.data) {
                handleNext();
            }
        } catch (error) {
            console.error("Error fetching available jobs:", error);
        } finally {
            setLoading(false);
        }
    }
    const handleSubmit = () => {
        toggleModal1();
    };
    const handleChat = () => {
        toggleModal2();
        if (page - 1 < empDetails.jobCount) {
            handleNext();
        } else {
            handleBack();
        }
    };
    const handleSubmitNext = () => {
        setIsChatVisible(false);
        toggleModal2();
        if (page - 1 < empDetails.jobCount) {
            handleNext();
        } else {
            handleBack();
        }
    };
    return (
        <div className="viewProfile employer-profileparent Viewingjob-page EmployerViewsJobs-section">
            <CruzLayout link="Employee">
                {loading ? (
                    <div className="page-loader">
                        <div className="page-innerLoader">
                            <div className="spinner-border" role="status">
                                <img src={require("../../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="center-layout">
                        <EmployerProfile jobProfile={jobProfile} medias={medias} />
                    </div>
                )}
                {!isMatch && (
                    <div className="layout-action">
                        <div className="views">
                            <p>{pageDetails}</p>
                        </div>
                        <div className="action-options">
                            <a onClick={() => handleDisLike()}>
                                <img
                                    src={require("../../../../assets/images/cruz/close-icon.png")}
                                    alt=""
                                    className="img-fluid"
                                />
                            </a>
                            <a onClick={() => handleBack()}>
                                <img
                                    src={require("../../../../assets/images/cruz/direction.png")}
                                    alt=""
                                    className="img-fluid"
                                />
                            </a>
                            <a onClick={() => handleLike()}>
                                <img
                                    src={require("../../../../assets/images/cruz/Tick.png")}
                                    alt=""
                                    className="img-fluid"
                                />
                            </a>
                        </div>
                    </div>
                )}
            </CruzLayout >
            <Modal
                isOpen={modal1Open}
                toggle={toggleModal1}
                className="sidebar-modal"
                fade={false}
                backdrop="static"
            >
                <ModalBody>
                    <div className="Employee-Profilemodal">
                        <div className="row">
                            <h2 className="customHeading">What’s next?</h2>
                            <div className="text-para">
                                <p>Your profile will show the employer you’re interested in this job.</p>
                            </div>
                            <div className="modal-actions">
                                <Button
                                    onClick={() => handleSubmit()}
                                    text="Continue Browsing Jobs"
                                    icon={true}
                                    theme="light"
                                    className="w-100 btn-dark"
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={modal2Open}
                toggle={toggleModal2}
                className="sidebar-modal"
                fade={false}
            >
                <ModalBody>
                    <div className="Employee-ProfilematchModal">
                        <div className="row">
                            <h2 className="customHeading">IT’S A MATCH!</h2>
                            <div className="text-para">
                                <p>You’re both interested in each other.</p>
                            </div>
                            <div className="imagegrid">
                                <div className="grid">
                                    {memberProfilePic ? (
                                        <img
                                            src={memberProfilePic}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    ) : (
                                        <img
                                            src={require("../../../../assets/images/profile/Default.jpg")}
                                            alt="Profile"
                                            className="img-fluid"
                                        />
                                    )}


                                </div>
                                <div className="grid">
                                    {profilePic ? (
                                        <img
                                            src={baseUrl + profilePic}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    ) : (
                                        <img
                                            src={require("../../../../assets/images/profile/Default.jpg")}
                                            alt="Profile"
                                            className="img-fluid"
                                        />
                                    )}

                                </div>
                            </div>
                            <div className="chatOption-btn">
                                <Button
                                    onClick={() => handleChat()}
                                    text="Chat with the Employer"
                                    icon={true}
                                    className="chat-optionbtn"
                                />
                                <a onClick={() => handleSubmitNext()} className="chatlater">
                                    Continue & chat later
                                </a>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
};
