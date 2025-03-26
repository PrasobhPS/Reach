import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { EmployeeProfile } from "../EmployeeProfile/EmployeeProfile";
import { EmployerProfile } from "../EmployerProfile/EmployerProfile";
import { useAvailableJobsListMutation } from "../ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useCampaignMatchesListMutation } from "../EmployerProfile/EmployerProfileApiSlice";
import { useSocket } from "../../../../contexts/SocketContext";
import { MemberInterface } from "../../../../types/PrivateChatInterfaces";
import { format } from 'date-fns';

interface Matches {
    id: number;
    employee_role: string;
    member_name: string;
    members_profile_picture: string;
    date: string;
    member_id?: number;
}
interface LikeCardProps {
    matches: Matches[];
    handleLike?: (id: number) => Promise<void>;
    from?: string;
    type: string;
    showButton?: boolean;
    getId?: string;
}
interface Media {
    id: number;
    media_file: string;
}

export const LikeCard: React.FC<LikeCardProps> = ({
    matches,
    handleLike,
    from,
    type,
    showButton = true,
    getId,
}) => {
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const [availableJobs] = useAvailableJobsListMutation();
    const [availableProfile] = useCampaignMatchesListMutation();

    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    };

    const [loading, setLoading] = useState(false);
    const [jobProfile, setJobProfile] = useState(null);
    const [medias, setMedias] = useState<Media[]>([]);
    const Loading = () => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }
    const handleShow = async (id: number, type: string) => {
        if (type === 'employee') {
            let jobData = {
                employee_id: getId,
                job_ids: [id],
                page: 1,
            };
            setLoading(true);
            try {
                const response = await availableJobs(jobData);
                if ('data' in response && response.data) {
                    setJobProfile(response.data.data[0]);
                    setMedias(response.data.data[0].job_images);
                }
            } catch (error) {
                console.error("Error fetching available jobs:", error);
            } finally {
                Loading();
            }
            toggle();
        } else {
            let jobData = {
                job_id: getId,
                employee_ids: [id],
                page: 1,
            };
            setLoading(true);
            try {
                const response = await availableProfile(jobData);
                if ('data' in response && response.data) {
                    setJobProfile(response.data.data[0]);
                    setMedias(response.data.data[0].employee_images);
                }
            } catch (error) {
                console.error("Error fetching available jobs:", error);
            } finally {
                Loading();
            }
            toggle();
        }
    }

    const { socket, privateMembers } = useSocket();
    const [activeMembers, setActiveMembers] = useState<string[]>([]);

    useEffect(() => {
        setActiveMembers(() => {
            return privateMembers.filter(member => member.active == true).map(member => String(member.member_id));
        });
    }, [privateMembers]);

    useEffect(() => {
        if (!socket?.connected) {
            setActiveMembers([]);
            return;
        }
    }, [socket]);

    const getLastMessageTime = (memberId: string | undefined) => {
        if (memberId) {
            const isoDateString = privateMembers.find(member => member.member_id == memberId)?.last_message_time;
            if (isoDateString) {
                return format(new Date(isoDateString), "dd MMMM yyyy hh:mm a");
            }
        }

        return null;
    };
    return (
        <div className="myMatches pl-0">
            <div className="innerbody">
                <table className="table match-result-table">
                    <tbody>
                        {matches?.map((emp: Matches, index: number) => {
                            const lastMessageTime = getLastMessageTime(String(emp?.member_id));

                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="profile-status">
                                            <div className={emp.member_id && activeMembers.includes(String(emp.member_id)) ? "profile-check" : ""}>
                                                <FontAwesomeIcon icon={faCircle} />
                                            </div>
                                            <a style={{ cursor: "pointer" }} onClick={() => handleShow(emp.id, type)} >
                                                <div className="profile-image">

                                                    {emp.members_profile_picture ? (
                                                        <img
                                                            src={baseUrl + emp.members_profile_picture}
                                                            alt="Profile"
                                                            className="imgfluid"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={require("../../../../assets/images/profile/Default.jpg")}
                                                            alt="Profile"
                                                            className="imgfluid"
                                                        />
                                                    )}

                                                </div>
                                            </a>
                                            <div className="profile-details">
                                                <a style={{ cursor: "pointer" }} onClick={() => handleShow(emp.id, type)}>
                                                    {type === 'employer' ? (
                                                        <>
                                                            <h5><span style={{ color: "#FFFFFF" }}>{emp.member_name}</span></h5>
                                                            <div className="emp-membername">
                                                                <span>{emp.employee_role}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h5><span style={{ color: "#FFFFFF" }}>{emp.employee_role}</span></h5>
                                                            <div className="emp-membername">
                                                                <span>{emp.member_name}</span>
                                                            </div>
                                                        </>
                                                    )}

                                                </a>
                                            </div>



                                        </div>
                                    </td>
                                    <td>
                                        <div className="profile-message pt-0 profile-messagecard">
                                            {showButton === true ? (
                                                <div className="profile-details">
                                                    {handleLike && (
                                                        <a style={{ cursor: "pointer" }} onClick={() => handleLike(emp.id)}>
                                                            {from === 'Liked' ? (
                                                                <img
                                                                    src={require("../../../../assets/images/cruz/close-icon.png")}
                                                                    alt=""
                                                                    className="img-fluid"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={require("../../../../assets/images/cruz/Tick.png")}
                                                                    alt=""
                                                                    className="img-fluid"
                                                                />
                                                            )}

                                                        </a>
                                                    )}
                                                </div>
                                            ) : ""}
                                            {showButton === false ? (
                                                <div className={lastMessageTime ? "message" : "d-none"}>
                                                    <h5>
                                                        Last Message
                                                        <br></br>
                                                        <span>{lastMessageTime}</span>
                                                    </h5>
                                                </div>
                                            ) : ""}
                                            <div className="arrow-collapse">
                                                {handleLike && showButton === false ? (
                                                    <button className="link-action btn-linkemail" style={{ cursor: "pointer" }} onClick={() => handleLike(emp.id)}><FontAwesomeIcon icon={faAngleRight} /></button>
                                                ) : (
                                                    <button className="link-action btn-linkemailtype" style={{ cursor: "pointer" }} onClick={() => handleShow(emp.id, type)}><FontAwesomeIcon icon={faAngleRight} /></button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <Modal
                    isOpen={modal}
                    toggle={toggle}
                    centered
                    className="Preview-mode-modal"
                >
                    <ModalBody>
                        <ModalHeader toggle={toggle}>
                        </ModalHeader>
                        <div className="action-modal">
                            {type === 'employee' ? (
                                <EmployerProfile jobProfile={jobProfile} medias={medias} />
                            ) : (
                                <EmployeeProfile employeeProfile={jobProfile} medias={medias} />
                            )}

                        </div>
                    </ModalBody>
                </Modal>

            </div >
        </div>
    )
}