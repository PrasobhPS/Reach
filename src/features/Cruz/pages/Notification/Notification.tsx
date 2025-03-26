import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/cruz.scss";
import { useMyLikedListQuery } from "../../Api/CampaignApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { Button } from "../../../../components/Button/Button";
import { Navigate, Route, Routes } from "react-router-dom";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText } from 'reactstrap';
import './Notification.scss';
import classnames from 'classnames';
import { useMyInterviewListQuery, useJobInterviewListQuery, useAcceptInterviewMutation } from "../../Api/InterviewApiSlice";
import { useSocket } from "../../../../contexts/SocketContext";
import moment from "moment";
import { BookModal } from "../../../Profile/Components/BookModal";
import Swal from "sweetalert2";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { EmployerProfile } from "../../components/EmployerProfile/EmployerProfile";
import { EmployeeProfile } from "../../components/EmployeeProfile/EmployeeProfile";
import { useAvailableJobsListMutation } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useCampaignMatchesListMutation } from "../../components/EmployerProfile/EmployerProfileApiSlice";
import { MemberInterface } from "../../../../types/PrivateChatInterfaces";

interface notification {
    id: number;
    member_id: number;
    interview_date: Date;
    interview_status: string;
    interview_time: string;
    job_role: string;
    job_summary: string;
    location: string;
    day: string;
    month: string;
    time: string;
    full_name: string;
    members_profile_picture: string;
    meeting_id: string;
    employee_id: number;
    job_id: number;
}
interface Media {
    id: number;
    media_file: string;
}
export const Notification = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('1');
    const { socket, cruzPendingMsgCount, setCruzPendingMsgCount, setPrivateChatMember, setIsInterview, setChatType, setIsChatVisible } = useSocket();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberId, setMemberId] = useState('0');
    const [interviewId, setInterviewId] = useState('0');
    const [memberFname, setMemberFName] = useState('');
    const [memberLname, setMemberLName] = useState('');
    const [memberDp, setMemberDp] = useState('');
    const [timeSlot, setTimeSlot] = useState<'1 hour' | '30 min'>('1 hour');
    const [interviewStatus, setInterviewStatus] = useState<string>('P');
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const navigate = useNavigate();
    const [jobProfile, setJobProfile] = useState(null);
    const [medias, setMedias] = useState<Media[]>([]);
    const [type, setType] = useState<string>('');
    const [totalCount, setTotalCount] = useState<number>(0);

    const toggle = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
        myInterviewRefetch();
        jobInterviewRefetch();
    };

    const handleRearrange = (id: number, member_id: number, memberName: string, memberDp: string, status: string) => {
        setMemberId(String(member_id));
        setInterviewId(String(id));
        setMemberFName(memberName);
        setMemberDp(baseUrl + memberDp);
        setInterviewStatus(status);
        setIsModalOpen(true);
    }

    const [newProfileInterview, setnewProfileInterview] = useState<notification[]>([]);
    const { data: profileInterview, error, isSuccess, isLoading, refetch: myInterviewRefetch } = useMyInterviewListQuery({});
    const interviewDetails = profileInterview?.data || [];

    const { data: jobInterview, error: jobError, isSuccess: jobSuccess, isLoading: jobLoading, refetch: jobInterviewRefetch } = useJobInterviewListQuery({});
    const jobDetails = jobInterview?.data || [];

    const [cruzMemberList, setCruzMemberList] = useState<MemberInterface[]>([]);

    useEffect(() => {
        if (interviewDetails.length || jobDetails.length) {
            setTotalCount(interviewDetails.length + jobDetails.length);
        }
    }, [interviewDetails, jobDetails]);

    useEffect(() => {
        socket?.emit('cruzChatList');
        socket?.emit('unreadCruzMessageCount');
    }, [activeTab]);

    const [acceptInterview] = useAcceptInterviewMutation();
    const handleAccept = async (id: number, status: string, from: string) => {
        const params = {
            interview_id: id,
            status: status,
            is_cancel: from,
        };
        const response = await acceptInterview(params);

        if ("error" in response) {
            console.error(JSON.stringify(response.error));
        }
        myInterviewRefetch();
        jobInterviewRefetch();
    }

    const handleCancel = async (id: number, status: string, from: string) => {

        Swal.fire({
            title: 'Cancel Interview?',
            text: 'The interview will be cancelled.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'Cancel',
            backdrop: `
          rgba(255, 255, 255, 0.5)
          left top
          no-repeat
          filter: blur(5px);
        `,
            background: '#fff',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const params = {
                        interview_id: id,
                        status: status,
                        is_cancel: from,
                    };
                    const response = await acceptInterview(params);

                    if ("error" in response) {
                        console.error(JSON.stringify(response.error));
                    }

                    if ("error" in response) {
                        console.error("Error logging in:", response.error);
                    } else {
                        Swal.fire({
                            title: "Cancel!",
                            text: "The interview cancelled successfully",
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
                        myInterviewRefetch();
                        jobInterviewRefetch();
                    }
                } catch (error) {
                    console.error("Error archiving campaign:", error);
                }
            }
        });
    }

    const handleJoin = (details: any) => {
        const postParams = {
            meeting_id: details.meeting_id ?? 'demo',
            subject: 'Reach Interview',
            type: 'interview'
        };

        const queryString = new URLSearchParams(postParams).toString();
        window.open(`/video-call?${queryString}`, '_blank');
    }

    const defaultLocale = 'en-US';
    const formatDate = (dateObject: Date | string, days: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };

        const date = new Date(dateObject); // Convert to Date object

        if (days === "days") {
            return date.toLocaleDateString(defaultLocale, { day: options.day });
        } else {
            return date.toLocaleDateString(defaultLocale, { month: options.month });
        }
    };

    const formatTime = (timeString: string) => {
        const date = new Date(`1970-01-01T${timeString}`);
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        return formattedTime;
    };

    const formatLastSeen = (dateString: string) => {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',   // Use 'numeric' for 4-digit year
            month: 'long',     // Full month name
            day: '2-digit',    // Two-digit day
            hour: 'numeric',   // Numeric hour (12-hour format if hour12 is true)
            minute: 'numeric', // Numeric minute
            hour12: true       // Use 12-hour format
        };

        return date.toLocaleString(defaultLocale, options);
    };

    function convertToUKTime(date: Date): Date {
        return new Date(date.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        myInterviewRefetch();
        jobInterviewRefetch();

    };
    function changeTimeSlot(value: any): void {
        throw new Error("Function not implemented.");
    }

    const [availableJobs] = useAvailableJobsListMutation();
    const [availableProfile] = useCampaignMatchesListMutation();
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const Loading = () => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }
    const toggleModal = () => {
        setModal(!modal);
    };

    const handleShow = async (id: number, employee_id: number, type: string) => {
        setType(type);
        if (type === 'employee') {
            let jobData = {
                employee_id: employee_id,
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
            toggleModal();
        } else {
            let jobData = {
                job_id: id,
                employee_ids: [employee_id],
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
            toggleModal();
        }
    }

    useEffect(() => {
        myInterviewRefetch();
        jobInterviewRefetch();
    }, [])

    useEffect(() => {
        if (!socket?.connected) return;

        socket.emit('cruzChatList');
        socket.emit('unreadCruzMessageCount');

        socket.on('cruzChatList', (members: MemberInterface[]) => {
            setCruzMemberList(members);
        });

        // socket.on('unreadCruzMessageCount', (count: number) => {
        //     setCruzPendingMsgCount(count);
        // });

        return () => {
            socket.off('cruzChatList');
            // socket.off('unreadCruzMessageCount');
        };
    }, [socket]);

    const openChat = (member: MemberInterface) => {
        setPrivateChatMember(member);
        setIsInterview(false);
        setChatType('CRUZ');
        setIsChatVisible(true);
    };

    return (
        <div className="notificaton">
            <CruzLayout link="Employer">
                <div className="Notification-parent">
                    <Breadcrumbs
                        mainbreadcrumb="INTERVIEWS/MESSAGES"
                        secondbreadcrumb={location.state}
                        redirectUrl="/cruz/notification"
                    />
                    <div className="nav-tabscontent w-100">
                        {/* <div className="Notification-heading">
                            <h2 className="customHeading">Notifications</h2>
                        </div> */}
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggle('1'); }}
                                >
                                    Interviews
                                    <span className="count">{totalCount}</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}
                                >
                                    Messages
                                    {cruzPendingMsgCount > 0 && <span className="count">{cruzPendingMsgCount}</span>}
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <div className="notification-page">
                                            <div className="notification-second">
                                                {
                                                    interviewDetails && interviewDetails.length > 0 && (
                                                        <div className="Notification-heading">
                                                            <h2 className="customHeading mb-0">My Interview List</h2>
                                                        </div>
                                                    )}
                                                {
                                                    interviewDetails && Array.isArray(interviewDetails) && interviewDetails.map((details: notification) => {
                                                        const interviewDate = moment(new Date(`${details.interview_date}T${details.interview_time}`));
                                                        const nowTime = convertToUKTime(new Date());
                                                        const minuteDifference = interviewDate.diff(nowTime, 'minute');
                                                        let disabled = true;
                                                        let btnTheme: 'grey' | 'light' | 'dark' | undefined = 'grey';
                                                        let showRearrange = '';
                                                        if (minuteDifference < 5 && minuteDifference > -60) {
                                                            disabled = false;
                                                            btnTheme = 'light';
                                                            showRearrange = 'd-none';
                                                        }
                                                        return (
                                                            <div className="booking-tabledata">
                                                                <div className="d-block">
                                                                    <div className="tabledata">
                                                                        <div className="dateSection-card">
                                                                            <div className="date-section">
                                                                                <h2 className="customHeading">{formatDate(details.interview_date, "days")}</h2>
                                                                                <div className="month"><span>{formatDate(details.interview_date, "month")}</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="details">
                                                                            <div className="details-content">
                                                                                <div className="profiledetails">

                                                                                    <a style={{ cursor: "pointer" }} onClick={() => handleShow(details.job_id, details.employee_id, 'employee')} >
                                                                                        <div className="profile-section">
                                                                                            <div className="image-section">
                                                                                                {details.members_profile_picture ? (
                                                                                                    <img
                                                                                                        style={{ borderRadius: "50%" }}
                                                                                                        src={baseUrl + details.members_profile_picture}
                                                                                                        className="img-fluid applicant-one"
                                                                                                        alt=""
                                                                                                    />
                                                                                                ) : (
                                                                                                    <img
                                                                                                        style={{ borderRadius: "50%" }}
                                                                                                        src={require("../../../../assets/images/profile/Default.jpg")}
                                                                                                        className="img-fluid applicant-one"
                                                                                                        alt=""
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="profile-details">
                                                                                                <h2 className="customHeading">{details.job_role}</h2>
                                                                                                <p>{details.full_name}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </a>
                                                                                </div>
                                                                                <div className="timesprice-details">
                                                                                    <div className="times">
                                                                                        <div className="time-details"><span className="time">{formatTime(details.interview_time)}</span><span className="location">London (GMT)</span></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="action-field">
                                                                    <div className="action">
                                                                        <div className="grp-btn ">



                                                                            {details.interview_status != 'H' && details.interview_status != 'C' && (
                                                                                <div className="Rearrange">
                                                                                    <Button
                                                                                        onClick={(event) => handleRearrange(details.id, details.member_id, details.full_name, details.members_profile_picture, 'R')}
                                                                                        text="Rearrange"
                                                                                        icon={false}
                                                                                        theme="light"
                                                                                        className={`btn-Rearrange ${showRearrange}`}
                                                                                    />
                                                                                    <Button
                                                                                        onClick={(event) => handleCancel(details.id, 'C', 'employee')}
                                                                                        text="Cancel"
                                                                                        icon={false}
                                                                                        theme="light"
                                                                                        className="btn-Rearrange"
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                        <div className="joinAll ">
                                                                            {details.interview_status === 'P' && (
                                                                                <Button
                                                                                    onClick={(event) => handleAccept(details.id, 'A', 'employee')}
                                                                                    text="Accept"
                                                                                    icon={true}
                                                                                    theme="light"
                                                                                    className="w-100"
                                                                                />
                                                                            )}

                                                                            {details.interview_status === 'A' && (
                                                                                <Button
                                                                                    onClick={(event) => handleJoin(details)}
                                                                                    text="Join"
                                                                                    icon={true}
                                                                                    theme={btnTheme}
                                                                                    className="w-100"
                                                                                    disabled={disabled}
                                                                                />
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className="notification-second pt-4">
                                                {
                                                    jobDetails && jobDetails.length > 0 && (
                                                        <div className="Notification-heading">
                                                            <h2 className="customHeading mb-0">Job Interview List</h2>
                                                        </div>
                                                    )}
                                                {
                                                    jobDetails && Array.isArray(jobDetails) && jobDetails.map((details: notification) => {
                                                        const interviewDate = moment(new Date(`${details.interview_date}T${details.interview_time}`));
                                                        const nowTime = convertToUKTime(new Date());
                                                        const minuteDifference = interviewDate.diff(nowTime, 'minute');
                                                        let disabled = true;
                                                        let btnTheme: 'grey' | 'light' | 'dark' | undefined = 'grey';
                                                        if (minuteDifference < 5 && minuteDifference > -60) {
                                                            disabled = false;
                                                            btnTheme = 'light';
                                                        }
                                                        return (
                                                            <div className="booking-tabledata">
                                                                <div className="d-block">
                                                                    <div className="tabledata">
                                                                        <div className="dateSection-card">
                                                                            <div className="date-section">
                                                                                <h2 className="customHeading">{formatDate(details.interview_date, "days")}</h2>
                                                                                <div className="month"><span>{formatDate(details.interview_date, "month")}</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="details">
                                                                            <div className="details-content">
                                                                                <div className="profiledetails">
                                                                                    <a style={{ cursor: "pointer" }} onClick={() => handleShow(details.job_id, details.employee_id, 'employer')} >
                                                                                        <div className="profile-section">
                                                                                            <div className="image-section">
                                                                                                {details.members_profile_picture ? (
                                                                                                    <img
                                                                                                        style={{ borderRadius: "50%" }}
                                                                                                        src={baseUrl + details.members_profile_picture}
                                                                                                        className="img-fluid applicant-one"
                                                                                                        alt=""
                                                                                                    />
                                                                                                ) : (
                                                                                                    <img
                                                                                                        style={{ borderRadius: "50%" }}
                                                                                                        src={require("../../../../assets/images/profile/Default.jpg")}
                                                                                                        className="img-fluid applicant-one"
                                                                                                        alt=""
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="profile-details">
                                                                                                <h2 className="customHeading">{details.full_name}</h2>
                                                                                                <p>{details.job_role}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </a>
                                                                                </div>
                                                                                <div className="timesprice-details">
                                                                                    <div className="times">
                                                                                        <div className="time-details"><span className="time">{formatTime(details.interview_time)}</span><span className="location">London (GMT)</span></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="action-field">
                                                                    <div className="action">
                                                                        <div className="grp-btn ">



                                                                            {details.interview_status != 'H' && details.interview_status != 'C' && (
                                                                                <div className="Rearrange">
                                                                                    <Button
                                                                                        onClick={(event) => handleRearrange(details.id, details.member_id, details.full_name, details.members_profile_picture, 'P')}
                                                                                        text="Rearrange"
                                                                                        icon={false}
                                                                                        theme="light"
                                                                                        className="btn-Rearrange"
                                                                                    />
                                                                                    <Button
                                                                                        onClick={(event) => handleCancel(details.id, 'C', 'job')}
                                                                                        text="Cancel"
                                                                                        icon={false}
                                                                                        theme="light"
                                                                                        className="btn-Rearrange"
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                        <div className="joinAll ">
                                                                            {details.interview_status === 'R' && (
                                                                                <Button
                                                                                    onClick={(event) => handleAccept(details.id, 'A', 'job')}
                                                                                    text="Accept"
                                                                                    icon={true}
                                                                                    theme="light"
                                                                                    className="w-100"
                                                                                />
                                                                            )}

                                                                            {details.interview_status === 'A' && (
                                                                                <Button
                                                                                    onClick={(event) => handleJoin(details)}
                                                                                    text="Join"
                                                                                    icon={true}
                                                                                    theme={btnTheme}
                                                                                    className="w-100"
                                                                                    disabled={disabled}
                                                                                />
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        <div className="notification-page">
                                            {
                                                cruzMemberList.map(member => {
                                                    return (<div className="booking-tabledata" key={member.member_id}>
                                                        <div className="msg-block">
                                                            <div className="firstblock">
                                                                <div className="profile-block">
                                                                    <div className="profile-details">
                                                                        <img src={member.member_profile_picture ? baseUrl + member.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")} />
                                                                        <div className={member.active ? "active-status" : "non-active"}>
                                                                            <span><FontAwesomeIcon icon={faCircle} /></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="profile-msgdetails">
                                                                        <div className="names">
                                                                            <label className="username">{`${member.member_fname} ${member.member_lname}`}</label>
                                                                            {/* <span className="position">cheif engineer</span> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="active-time">
                                                                    <span className="d-block">Last Message</span>
                                                                    {member.last_message_time && <span className="d-block">{formatLastSeen(member.last_message_time)}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="right-block">
                                                                <span className="d-block dates-mob d-md-none">{member.last_message_time ? formatLastSeen(member.last_message_time) : ''}</span>
                                                                <div className="arrow-action">
                                                                    <div className="unreadmsgs">
                                                                        {member.pending_message_count > 0 && <span className="unread">{member.pending_message_count}</span>}
                                                                    </div>
                                                                    <button className="link-action btn-linkemail" style={{ cursor: "pointer" }} onClick={() => openChat(member)}><FontAwesomeIcon icon={faAngleRight} /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>);
                                                })
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>

                    </div>
                </div>
            </CruzLayout >
            {isModalOpen && (
                <BookModal isOpen={isModalOpen} toggleClose={handleCloseModal} userId={memberId} specialistName={memberFname} specialistLastName={memberLname} timeSlot={timeSlot} specialistDp={memberDp} changeTimeSlot={changeTimeSlot} reason={''} bookingId={interviewId} from={'interview'} interviewStatus={interviewStatus} />
            )}

            <Modal
                isOpen={modal}
                toggle={toggleModal}
                centered
                className="Preview-mode-modal"
            >
                <ModalBody>
                    <ModalHeader toggle={toggleModal}>
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
    )
}
export default Notification;