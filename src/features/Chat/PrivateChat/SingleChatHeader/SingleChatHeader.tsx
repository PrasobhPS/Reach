import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./SinglechatHeader.scss";
import { faAngleLeft, faAngleDown, faFlag, faBan, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../../../contexts/SocketContext';
import { Button } from '../../../../components/Button/Button';
import { Link } from 'react-router-dom';
import SetInterviewModal from '../components/SetInterviewModal';
import { useNavigate } from 'react-router-dom';
import ReportMember from '../components/ReportMember';
import { MemberInterface } from '../../../../types/PrivateChatInterfaces';
import moment from 'moment';
import Swal from 'sweetalert2';
import { getUserData } from '../../../../utils/Utils';

const baseUrl = process.env.REACT_APP_STORAGE_URL;

export const SingleChatHeader = () => {
    const { socket, isConnected, setIsChatVisible, setShowChatList, privateChatMember,setPrivateMembers, setPrivateChatMember, isInterview, employeeDetails, isChatVisible, chatType, privateMembers } = useSocket();
    const navigate = useNavigate();
    const [toggleInfoTab, setToggleInfoTab] = useState<boolean>(false);
    const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const userActionRef = useRef<HTMLDivElement | null>(null);
    const [reportMember, setReportMember] = useState<MemberInterface>();
    const [meetingId, setMeetingId] = useState<string>();
    const [enableInterviewBtn, setEnableInterviewBtn] = useState<boolean>(false);
    const [interviewBtnLabel, setInterviewBtnLabel] = useState<string>('Set Interview');
    const [status, setStatus] = useState<string>('');
    const userData = getUserData('userData');

    const [showUserReportPopup, setShowUserReportPopup] = useState<boolean>(false);
    const [isReportAndBlock, setIsReportAndBlock] = useState<boolean>(true);
    const [userReportSubmitted, setUserReportSubmitted] = useState<boolean>(false);

    useEffect(() => {
        setStatus(() => {
            if (privateChatMember && privateChatMember?.member_id <= '0') return '';

            const member = privateMembers.find(member => member.member_id == privateChatMember?.member_id);

            if (member) {
                return member.active ? 'Online' : 'Offline';
            }

            return 'Offline';
        });
    }, [privateMembers, privateChatMember]);


    document.addEventListener('mousedown', (event: MouseEvent) => {
        if (userActionRef.current && !userActionRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    });

    const blockOrUnblockMember = () => {
        if (socket?.connected && privateChatMember) {
            if (privateChatMember.is_blocked == true)
                socket.emit('unblock', privateChatMember.member_id);
            else
                socket.emit('block', privateChatMember.member_id);
        }
    };

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('block', (blocked_member_id: string) => {
            if (privateChatMember?.member_id == blocked_member_id) {
                setPrivateChatMember((prevData) => {
                    if (prevData) {
                        const updatedData = {
                            ...prevData,
                            is_blocked: true,
                        };

                        return updatedData;

                    } else {
                        return undefined;
                    }
                });
            }
        });

        socket.on('unblock', (unblocked_member_id: string) => {
            if (privateChatMember?.member_id == unblocked_member_id) {
                setPrivateChatMember((prevData) => {
                    if (prevData) {
                        const updatedData = {
                            ...prevData,
                            is_blocked: false,
                        };

                        return updatedData;

                    } else {
                        return undefined;
                    }
                });
            }
        });

        socket.on('hasInterviewExist', (meetings) => {
            if (meetings.length > 0) {
                const timeZone = 'Europe/London';
                const meeting = meetings[0];
                setMeetingId(meeting.meeting_id);
                const meetingTime = moment.tz(`${meeting.interview_date} ${meeting.interview_time}`, timeZone);
                const currentTime = moment.tz(timeZone);
                const differenceInMinutes = meetingTime.diff(currentTime, 'minutes');

                if (meeting.interview_status == 'A' && differenceInMinutes <= 5 && differenceInMinutes >= -60) {
                    setInterviewBtnLabel('Join Interview');
                    setEnableInterviewBtn(true);
                } else {
                    setEnableInterviewBtn(false);
                    setInterviewBtnLabel('Interview Booked');
                }
            } else {
                setInterviewBtnLabel('Set Interview');
                setMeetingId(undefined);
                setEnableInterviewBtn(true);
            }
        });

        socket.on('reportUser', (data) => {

            console.log(data,'data.is_blocked');
            
            setPrivateChatMember(privateMember => {
                if (privateMember && privateMember.member_id === privateChatMember?.member_id) {
                    return { ...privateMember, is_reported: true, is_blocked:data.is_blocked };
                }
                return privateMember;
            });
            
            setPrivateMembers((prevMembers) =>
                prevMembers.map((member) =>{
                    return member.member_id === privateChatMember?.member_id
                      ? { ...member, is_reported: true, is_blocked: data.is_blocked } : member
                }
            ));

            setUserReportSubmitted(true);
        });

        return () => {
            socket.off('block');
            socket.off('unblock');
            socket.off('hasInterviewExist');
            socket.off('reportUser');
        };
    }, [isConnected, privateChatMember]);

    useEffect(() => {

        if(userReportSubmitted){
            Swal.fire({
                html: `<p>Thanks for your report!. <br> We'll review it and take action as needed.</p>`,
                icon: "warning",
                confirmButtonText: "Ok",
                target: '#Message-area-outer',
                customClass: {
                    container: 'report-message-swal',
                },
                preConfirm: () => {
                    if(privateChatMember?.is_blocked){
                        setShowChatList(true); 
                        setPrivateChatMember(undefined); 
                        setIsChatVisible(false);
                    }
                    return;
                }
            })
        }

        return () => {
            setUserReportSubmitted(false);
        }

    },[userReportSubmitted, privateChatMember])

    useEffect(() => {
        if (isChatVisible) {
            setShowMenu(false);
            setToggleInfoTab(false);
        }
    }, [isChatVisible]);

    const handleProfileImageClick = () => {
        if (privateChatMember && privateChatMember?.member_id > '0') {
            if (privateChatMember?.job_role) {
                setToggleInfoTab(!toggleInfoTab);
            } else {
                navigate(`/publicprofile`,
                    {
                        state: privateChatMember?.member_id,
                    });
            }
        }
    };

    useEffect(() => {
        if (chatType == 'CRUZ' && socket?.connected && employeeDetails) {
            socket.emit('hasInterviewExist', {
                job_id: employeeDetails.job_id,
                employee_id: employeeDetails.employee_id
            });
        }
    }, [employeeDetails, isChatVisible]);

    const JoinInterview = () => {
        setIsChatVisible(false);

        const postParams = {
            meeting_id: meetingId ?? 'demo',
            subject: 'Reach Interview',
            type: 'interview'
        };

        const queryString = new URLSearchParams(postParams).toString();
        window.open(`/ video - call ? ${queryString}`, '_blank');
    };

    const handleUserReport = () => {

        if(!privateChatMember?.is_reported) {
            Swal.fire({
                title: "Report User?",
                html: `
                <p>The last 5 messages from this contact will be forwarded to Reach. This contact will not be notified.</p>
                <div style="text-align: left; margin-top: 10px;">
                    <div class="checkbox-container">
                        <label>
                            <input type="checkbox" id="blockAndReport" style="margin-right: 5px;" checked/>
                            Block contact and delete chat
                        </label>
                    </div>
                </div>
                `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Report",
                cancelButtonText: "Cancel",
                target: '#Message-area-outer',
                customClass: {
                    container: 'report-message-swal',
                },
                preConfirm: () => {
                    const blockAndReport = document.getElementById('blockAndReport') as HTMLInputElement;
                    socket?.emit('reportUser', {
                        sender_id: userData?.Member_id,
                        reciever_id: privateChatMember?.member_id,
                        is_blocked: blockAndReport.checked,
                    });
                    return;
                }
            })
        }else{
            setUserReportSubmitted(true)
        }
    };
    
    return (
        <>
            <div className="single-chat-header d-flex align-items-center justify-content-between">
                <div className="left-area d-flex align-items-center">
                    <div className="back-icon" onClick={() => { if (chatType == 'PRIVATE') setShowChatList(true); setIsChatVisible(false); }}>
                        <span className="icon"><FontAwesomeIcon icon={faAngleLeft} /></span>
                    </div>
                    <div className="profile-head d-flex align-items-center">
                        <div className="pro-img cursor-pointer" onClick={handleProfileImageClick}>
                            <img
                                src={privateChatMember?.member_profile_picture ? (privateChatMember.member_id <= '0' ? '' : baseUrl) + privateChatMember.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                alt="Profile Image"
                            />
                        </div>
                        <div className="pro-label">
                            <h6>{privateChatMember?.member_fname} {privateChatMember?.member_lname}</h6>
                            {!privateChatMember?.has_blocked_by &&
                                <span>{status}</span>
                            }
                        </div>
                    </div>
                </div>
                <div className="align-items-center d-flex">
                    <div className={chatType == 'CRUZ' && isInterview ? "interview-button me-3" : "d-none"} style={{ opacity: enableInterviewBtn ? 1 : 0.6 }}>
                        <Button
                            onClick={() => meetingId ? JoinInterview() : setShowInterviewModal(true)}
                            text={interviewBtnLabel}
                            icon={false}
                            theme="light"
                            disabled={!enableInterviewBtn}
                        />
                    </div>
                    <div className="close-chat" onClick={() => setIsChatVisible(false)}>
                        <span className="icon"><FontAwesomeIcon icon={faAngleDown} /></span>
                    </div>
                    <div className={chatType == 'PRIVATE' && privateChatMember && privateChatMember?.member_id > '0' ? "user-action-wrapper ms-3" : "d-none"} ref={userActionRef}>
                        <div className="user-action" onClick={() => setShowMenu(!showMenu)}>
                            <span><FontAwesomeIcon icon={faEllipsisV} /></span>
                        </div>
                        <div className={showMenu ? "action" : "d-none"}>
                            <ul>
                                <li onClick={blockOrUnblockMember} className={privateChatMember?.is_blocked ? 'confirm' : ''}>
                                    <span><FontAwesomeIcon icon={faBan} /></span>{privateChatMember?.is_blocked ? 'Unblock' : 'Block'}
                                </li>
                                <li onClick={handleUserReport}>
                                    <span><FontAwesomeIcon icon={faFlag} /></span>Report
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={toggleInfoTab ? "profile-details w-100" : "d-none"}>
                <p className={privateChatMember?.job_summary ? "" : "d-none"}>{privateChatMember?.job_summary}</p>
                <ul className="d-flex">
                    <li className={privateChatMember?.job_role ? "" : "d-none"}>{privateChatMember?.job_role}</li>
                    <li className={privateChatMember?.age ? "" : "d-none"}>{privateChatMember?.age}</li>
                    <li className={privateChatMember?.gender ? "" : "d-none"}>{privateChatMember?.gender}</li>
                </ul>
                {privateChatMember?.job_role && <a onClick={() => navigate(`/publicprofile`,
                    {
                        state: privateChatMember?.member_id,
                    })} className="profile-link">Full Profile</a>}
            </div>
            {isInterview && privateChatMember && employeeDetails && <SetInterviewModal showInterviewModal={showInterviewModal} setShowInterviewModal={setShowInterviewModal} />}
        </>
    )
}

export default SingleChatHeader;
