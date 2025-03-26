import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Chatlist.scss";
import { faAngleLeft, faAngleRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { InterviewInterface, MemberInterface, MessageInterface, MessageRequestInterface } from "../../../../types/PrivateChatInterfaces";
import { useSocket } from '../../../../contexts/SocketContext';
import { getUserData } from "../../../../utils/Utils";
import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';
import InterviewOfferedModal from "../components/InterviewOfferedModal";
import { useMemberNotificationsMutation } from "../../Api/MemberNotificationsApiSlice";

const getTimeDifference = (date: Date) => {
    let timeDifference = formatDistanceToNow(date, { addSuffix: true });

    if (timeDifference.startsWith('about ')) {
        timeDifference = timeDifference.replace('about ', '');
    }

    return `Joined ${timeDifference}`;
};

const formatDate = (dateString: string) => {
    const date = parseISO(dateString);

    if (isToday(date)) {
        return `Today ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
        return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
        const day = Number(format(date, 'd'));
        const month = format(date, 'MMM');
        const s = ["th", "st", "nd", "rd"];
        const v = day % 100;
        const dayPostValue = day + (s[(v - 20) % 10] || s[v] || s[0]);
        return `${dayPostValue} ${month} ` + format(date, 'h:mm a');
    }
};
export const ChatList = () => {
    const [filteredMembers, setFilteredMembers] = useState<MemberInterface[]>([]);
    const [search, setSearch] = useState<string>('');
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const sliderRef = useRef(null);
    const {
        socket, showChatList,
        privateMembers: members, messageRequests,
        privateChatMember, setShowChatList,
        setIsChatVisible, setPrivateChatMember,
        setIsInterview, setChatType,
        notifications, setNotifications
    } = useSocket();
    const userData = getUserData('userData');
    const [myMessagesCount, setMyMessagesCount] = useState<number>(0);
    const [showMyMessages, setShowMyMessages] = useState<boolean>(true);
    const [interviewDetails, setInterviewDetails] = useState<InterviewInterface>();
    const [memberNotificationsCall] = useMemberNotificationsMutation();
    const [notificationCount, setNotificationCount] = useState<number>(0);

    const handleMemberNotifications = async () => {
        if (userData) {
            const params = {
                member_id: userData.Member_id,
            };

            const response = await memberNotificationsCall(params);

            if ("error" in response) {
                console.error(JSON.stringify(response.error));
            } else {
                const result = response.data.data.map((data: any) => {
                    return {
                        message_id: data.id,
                        sender_id: '-1',
                        receiver_id: userData.Member_id,
                        status: data.is_read,
                        message: data.message,
                        timestamp: data.created_at,
                        emoji_replaced: true,
                        url_keyword: data.url_keyword,
                        job_id: data.job_id,
                        employee_id: data.employee_id
                    };
                });

                setNotifications(result);
            }
        }
    };

    useEffect(() => {
        setNotificationCount(() => {
            return notifications.filter(item => item.status == '0').length;
        });
    }, [notifications])

    const handleSearch = (e: any) => {
        setSearch(e.target.value);
    }

    const chatListDefaultMobileHeight = window.innerHeight * 75 / 100;

    useEffect(() => {
        let overlayDiv: HTMLDivElement | null;

        if (showChatList) {
            if (window.innerWidth <= 767 && chatListDiv.current) {
                chatListDiv.current.style.padding = '15px';
                chatListDiv.current.style.height = `${chatListDefaultMobileHeight}px`;
            }

            overlayDiv = document.createElement('div');
            overlayDiv.className = 'overlay';
            document.body.insertAdjacentElement('afterbegin', overlayDiv);
            document.body.style.overflowY = 'hidden';
            overlayDiv?.addEventListener('click', () => setShowChatList(false));
        } else {
            overlayDiv = document.querySelector('.overlay');
            if (overlayDiv) {
                overlayDiv.remove();
            }
            document.body.style.overflowY = 'auto';
        }
    }, [showChatList]);

    useEffect(() => {
        // members.forEach(member => {
        //     console.log(member.joined_at,'member.joined_at');
        //     // member.joined_at = getTimeDifference(new Date(member.joined_at));
        // });

        setMyMessagesCount(members.filter(member => member.pending_message_count > 0 && !member.is_blocked).length);
    }, [members]);

    useEffect(() => {
        socket?.emit('privateMembers');
    }, [privateChatMember, socket]);

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('interviewNotification', (data: InterviewInterface) => {
            setInterviewDetails(data);
        });

        return () => {
            socket.off('interviewNotification');
        };
    }, [socket]);

    const respondMessageRequest = (requestMemberId: string, status: string) => {
        if (socket?.connected) {
            socket.emit('respondRequest', {
                member_id: requestMemberId,
                status: status
            });
        }
    };

    useEffect(() => {
        if (showMyMessages) {
            setSearch('');
        }

        if (search.trim() != '') {
            const searchedMembers = members.filter(
                member => `${member?.member_fname} ${member?.member_lname}`
                .toLowerCase().includes(search.trim()
                .toLowerCase()) && member.chat_request_status != '0' && 
                member.has_reported_by !== true
            );
            setFilteredMembers(searchedMembers);
        } else {
            setFilteredMembers(members.filter(member => 
                (member.last_message_time != null && member.chat_request_status != '0') && 
                (member.is_reported !== true || member.is_blocked !== true)
            ));
        }
    }, [showMyMessages, members, search]);

    const chatListDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatListDiv.current) {
            chatListDiv.current.classList.add('d-none');
            chatListDiv.current.addEventListener('touchstart', disableReload);
        }
    }, []);

    useEffect(() => {
        if (showChatList)
            handleMemberNotifications();
    }, [showChatList]);

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('updateNotification', () => {
            handleMemberNotifications();
        });

        return () => {
            socket.off('updateNotification');
        };
    }, [socket]);

    const [chatListMobileHeight, setchatListMobileHeight] = useState<number>(chatListDefaultMobileHeight);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const disableReload = (event: TouchEvent): void => {
        const chatListArea = document.querySelector('.chat-list-area');

        if (chatListArea && !chatListArea.contains(event.target as Node)) {
            event.preventDefault();
        }
    };

    const handleTouchStart = () => {
        setIsDragging(true);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (window.innerWidth <= 767 && chatListDiv.current) {
            if (isDragging) {
                chatListDiv.current.style.transition = '';
            } else {
                if (chatListMobileHeight < (chatListDefaultMobileHeight / 1.5)) {
                    chatListDiv.current.style.padding = '0px 15px';
                    chatListDiv.current.style.transition = 'height 0.3s ease-in-out';
                    chatListDiv.current.style.height = '0px';
                    setShowChatList(false);
                } else {
                    chatListDiv.current.style.padding = '15px';
                    chatListDiv.current.style.transition = 'height 0.3s ease-in-out';
                    chatListDiv.current.style.height = `${chatListDefaultMobileHeight}px`;
                    chatListDiv.current.focus();
                }
            }
        }
    }, [isDragging]);

    const handleTouchMove = (event: any) => {
        if (isDragging) {
            if (chatListDiv.current) {
                const containerBottom = chatListDiv.current.getBoundingClientRect().bottom;
                const newHeight = containerBottom - event.touches[0].clientY;

                if (newHeight >= 0 && newHeight <= chatListDefaultMobileHeight) {
                    setchatListMobileHeight(newHeight);
                }
            }
        }
    };

    useEffect(() => {
        if (window.innerWidth <= 767 && chatListDiv.current) {
            chatListDiv.current.style.height = `${chatListMobileHeight}px`;
        }
    }, [chatListMobileHeight]);

    const reachBot: MemberInterface = {
        member_id: '0',
        member_fname: 'ASK',
        member_lname: 'REACH',
        member_profile_picture: require('../../../../assets/images/chat/chatbot.png'),
        active: true,
        joined_at: 'Grand Master',
        pending_message_count: 0,
        is_blocked: false,
        is_reported: false,
        has_blocked_by: false,
        has_reported_by: false,
    };

    const reachNotifier: MemberInterface = {
        member_id: '-1',
        member_fname: 'REACH',
        member_lname: 'COMMS',
        member_profile_picture: require('../../../../assets/images/chat/chatbot.png'),
        active: true,
        joined_at: 'Notifier',
        pending_message_count: 0,
        is_blocked: false,
        is_reported: false,
        has_blocked_by: false,
        has_reported_by: false,
    };

    const handleSetPrivateChatMember = (member: MemberInterface) => {
        setChatType('PRIVATE');
        setPrivateChatMember(member);
        setIsInterview(false);
        setIsChatVisible(true);
        setShowChatList(false);
        setShowMyMessages(true);
    };
     const isChatSearchVisible = !showMyMessages;

    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [OneNotificationVisible,setOnesNotificationVisible] = useState(false);
    useEffect(() => {
    const shouldShowNotification = messageRequests.length === 2 && showMyMessages;
    const OneNotification= messageRequests.length === 1 && showMyMessages ;   
    setIsNotificationVisible(shouldShowNotification);
    setOnesNotificationVisible(OneNotification);
    }, [messageRequests, showMyMessages]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots:false, 
        infinite:false,
        speed:500, 
        slidesToShow: 1, 
        slidesToScroll: 1,
        centerPadding: "10px",
        variableWidth: false,
        arrows: messageRequests.length > 1,
        afterChange: (current: SetStateAction<number>) => setCurrentSlide(current), 
        responsive: [
        {
            breakpoint: 768,
            settings: {
             dots:false, 
            infinite:false, 
            speed: 500, 
            slidesToShow: 1, 
            slidesToScroll: 1,
             variableWidth: false,
            arrows: messageRequests.length > 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                dots:false, 
                infinite:false, 
                speed: 500, 
                slidesToShow: 1, 
                 variableWidth: false,
                slidesToScroll: 1,
                arrows: messageRequests.length > 1,
            },
        },
        ],
    };
    const [shouldRenderSlider, setShouldRenderSlider] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
        setShouldRenderSlider(true);
        },1000); 
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <>
            <div
                ref={chatListDiv}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`chat-list-container h-100 ${showChatList ? 'show' : 'hide'}`}
            >
                <div onTouchStart={handleTouchStart} className="chat-list-head">
                    <div className="divider d-lg-none d-md-none"></div>
                </div>
                
                <div className="inner-block">
                    {/* space conflict */}
                    {/* <div>
                        <h3 className={showMyMessages ? '' : 'd-none'}>My messages <span>{myMessagesCount > 0 && `(${myMessagesCount})`}</span></h3>
                        <button className={showMyMessages ? 'btn btn-new-message mb-3' : 'd-none'} onClick={() => setShowMyMessages(false)}>
                            New Message <span><FontAwesomeIcon icon={faAngleRight} /></span>
                        </button>
                     
                        <div className="message-notification-parent">
                            {messageRequests.map((request: MessageRequestInterface) => {
                                return (
                                    <div className={showMyMessages ? 'message-notification' : 'd-none'} key={request.request_id}>
                                        <div className="chat-head d-flex align-items-center">
                                            <div className="user-img">
                                                <img
                                                    src={request.member_profile_picture ? baseUrl + request.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                    alt="Profile Image"
                                                />
                                            </div>
                                            <label>
                                                {request.member_fname + ' ' + request.member_lname}
                                            </label>
                                        </div>
                                        <div className="chat-message">
                                            <span>Wants to send you a message</span>
                                            <div className="d-flex align-items-center btn-area">
                                                <button className="btn btn-accept" onClick={() => respondMessageRequest(request.member_id, 'accepted')}>
                                                    Accept <span><FontAwesomeIcon icon={faAngleRight} /></span>
                                                </button>
                                                <button className="btn btn-deny" onClick={() => respondMessageRequest(request.member_id, 'denied')}>
                                                    Deny <span><FontAwesomeIcon icon={faAngleRight} /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div> */}
                    <div className="chat-list-area">
                         <div>
                            <h3 className={showMyMessages ? '' : 'd-none'}>My messages <span>{myMessagesCount > 0 && `(${myMessagesCount})`}</span></h3>
                            <button className={showMyMessages ? 'btn btn-new-message mb-3' : 'd-none'} onClick={() => setShowMyMessages(false)}>
                                New Message <span><FontAwesomeIcon icon={faAngleRight} /></span>
                            </button>
                     
                        <div  className={`message-notification-parent ${isChatSearchVisible ? 'Search-parent' : ''}`}>
                            {messageRequests.length > 0 && shouldRenderSlider && (
                                <div>
                                    <Slider {...settings} >
                                     
                                        {messageRequests.map((request: MessageRequestInterface ,index: number) => {
                                            const isFirstChild = index === 0;
                                            return (
                                                <div
                                                    className={`${showMyMessages ? 'message-notification' : 'd-none'} ${isFirstChild ? '' : 'newslider'}`}
                                                    key={request.request_id}
                                                >
                                                    
                                                    <div className="chat-head d-flex align-items-center">
                                                        <div className="user-img">
                                                            <img
                                                                src={request.member_profile_picture ? baseUrl + request.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                                alt="Profile Image"
                                                            />
                                                        </div>
                                                        <label>
                                                            {request.member_fname + ' ' + request.member_lname}
                                                        </label>
                                                    </div>
                                                    <div className="chat-message">
                                                        <span>Wants to send you a message</span>
                                                        <div className="d-flex align-items-center btn-area">
                                                            <button className="btn btn-accept" onClick={() => respondMessageRequest(request.member_id, 'accepted')}>
                                                                Accept <span><FontAwesomeIcon icon={faAngleRight} /></span>
                                                            </button>
                                                            <button className="btn btn-deny" onClick={() => respondMessageRequest(request.member_id, 'denied')}>
                                                                Deny <span><FontAwesomeIcon icon={faAngleRight} /></span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Slider>
                                     <div className="slider-count d-none">
                                         {currentSlide + 1} / {messageRequests.length}
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                        {/* <div className={showMyMessages ? 'd-none' : "chat-search"}> */}
                        <div className={isChatSearchVisible ? 'chat-search' : 'd-none'}>
                            <span className="chatlist-search-back"><FontAwesomeIcon icon={faAngleLeft} onClick={() => setShowMyMessages(true)} /></span>
                            <input placeholder="Search Members" value={search} onChange={handleSearch} />
                            <span><FontAwesomeIcon icon={faSearch} /></span>
                        </div>
                        <div className={`list-box ${isChatSearchVisible ? 'Search-action' : ''}  ${isNotificationVisible ? 'accept-notification' : ''} ${OneNotificationVisible ? 'onenotification':''} `}>
                            <div
                                className={`chat-user  d-flex align-items-center cursor-pointer online ${!showMyMessages && 'd-none'}`}
                                key={'reachbot'}
                                onClick={() => handleSetPrivateChatMember(reachBot)}
                            >
                                <div className="user-img">
                                    <img
                                        src={reachBot.member_profile_picture}
                                        alt="Profile Image"
                                    />
                                </div>
                                <div className="user-label">
                                    <h5>{`${reachBot.member_fname} ${reachBot.member_lname}`}</h5>
                                    {/* <span>{reachBot.joined_at}</span> */}
                                </div>
                            </div>
                            <div
                                className={`chat-user  d-flex align-items-center cursor-pointer online ${!showMyMessages && 'd-none'}`}
                                key={'reachNotifier'}
                                onClick={() => handleSetPrivateChatMember(reachNotifier)}
                            >
                                <div className="user-img">
                                    <img
                                        src={reachBot.member_profile_picture}
                                        alt="Profile Image"
                                    />
                                </div>
                                <div className="user-label">
                                    <h5>{`${reachNotifier.member_fname} ${reachNotifier.member_lname}`}</h5>
                                    {/* <span>{reachNotifier.joined_at}</span> */}
                                </div>
                                <div className="d-flex status-wraper align-items-center">
                                    <div className={notificationCount > 0 ? "status-count" : "d-none"}>{notificationCount}</div>
                                </div>
                            </div>
                            {
                                filteredMembers?.map(member => {
                                    if (member) {
                                        return (userData && userData.Member_id != member.member_id) && (
                                            <div
                                                className={`chat-user  d-flex align-items-center cursor-pointer ${member.active ? 'online' : ''}`}
                                                key={member.member_id}
                                                onClick={() => handleSetPrivateChatMember(member)}
                                            >
                                                <div className="user-img">
                                                    <img
                                                        src={member.member_profile_picture ? `${baseUrl}${member.member_profile_picture}` : require("../../../../assets/images/profile/Default.jpg")}
                                                        alt="Profile Image"
                                                    />
                                                </div>
                                                <div className="user-label">
                                                    <h5>{`${member.member_fname} ${member.member_lname}`}</h5>
                                                    {/* <span>{member.joined_at}</span> */}
                                                </div>
                                                <div className="d-flex status-wraper align-items-center">
                                                    {/* <div className={member.last_message_time ? "me-2 date" : "d-none"}>{member.last_message_time ? formatDate(member.last_message_time) : ''}</div> */}
                                                    <div className={member.pending_message_count > 0 ? "status-count" : "d-none"}>{member.pending_message_count}</div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            {interviewDetails != undefined && <InterviewOfferedModal interviewDetails={interviewDetails} setInterviewDetails={setInterviewDetails} />}
        </>
    );
};

export default ChatList;
