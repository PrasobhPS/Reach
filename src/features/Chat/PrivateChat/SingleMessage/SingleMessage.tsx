import "./DatefilterMessage.scss";
import "./SingleMessage.scss";
import { MessageInterface, ReactionInterface } from "../../../../types/PrivateChatInterfaces";
import { useSocket } from '../../../../contexts/SocketContext';
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { getUserData } from "../../../../utils/Utils";
import axios from 'axios';
import twemoji from "twemoji";
import Markdown from 'react-markdown';
import { renderToString } from 'react-dom/server';
import smileOuter from "../../../../assets/images/chat/smiles.png";
import { faAngleRight, faThumbsDown, faDownload, faEdit, faReply, faTrash, faClose, faArrowDown, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { MODAL_TYPES, useGlobalModalContext } from "../../../../utils/GlobalModal";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { useReadNotificationsMutation } from "../../Api/MemberNotificationsApiSlice";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
const baseUrl = process.env.REACT_APP_STORAGE_URL;
const socketUrl = process.env.REACT_APP_SOCKET_URL;

interface SingleChatMessageProps {
    replyMessage: MessageInterface | undefined;
    editMessage: MessageInterface | undefined;
    setReplyMessage: React.Dispatch<SetStateAction<MessageInterface | undefined>>;
    setEditMessage: React.Dispatch<SetStateAction<MessageInterface | undefined>>;
    setShowLoader: React.Dispatch<SetStateAction<boolean>>;
}

export const SingleChatMessage = ({ replyMessage, editMessage, setReplyMessage, setEditMessage, setShowLoader }: SingleChatMessageProps) => {
    const { socket, isChatVisible, setIsChatVisible, privateChatMember, chatType, notifications } = useSocket();
    const { showModal } = useGlobalModalContext();
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const [hasLoadMessage, setHasLoadMessage] = useState<boolean>(true);
    const userData = getUserData('userData');
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [isLoadMessage, setIsLoadMessage] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<MessageInterface>();
    const [emojiMessageId, setEmojiMessageId] = useState<string>();
    const [reactions, setReactions] = useState<{ [message_id: string]: { [emoji_id: string]: ReactionInterface[] } }>({});
    const messageRefs = useRef<{ [message_id: string]: HTMLDivElement | null }>({});
    const [reactionMessageId, setReactionMessageId] = useState<string>();
    const [openedImage, setOpenedImage] = useState<MessageInterface>();
    const [readNotificationsCall] = useReadNotificationsMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleReadNotifications = async () => {
        if (userData) {
            const params = {
                member_id: userData.Member_id,
            };

            const response = await readNotificationsCall(params);

            if ("error" in response) {
                console.error('read notification', JSON.stringify(response.error));
            }
        }
    };

    useEffect(() => {
        if (socket?.connected) {
            if (isChatVisible) {
                if (privateChatMember && privateChatMember.member_id >= '0') {
                    socket.emit('seenMessages', { member_id: privateChatMember.member_id, chat_type: chatType });
                }
                else if (privateChatMember && privateChatMember.member_id == '-1') {
                    handleReadNotifications();
                }
            }

            setTimeout(() => {
                socket.emit('unreadMessageCount');
            }, 100);
        }
    }, [isChatVisible, privateChatMember, socket, messages]);

    useEffect(() => {
        if (socket?.connected && isChatVisible && privateChatMember?.member_id) {
            socket.emit('seenMessages', { member_id: privateChatMember.member_id, chat_type: chatType });
            setTimeout(() => {
                socket.emit('unreadMessageCount');
            }, 100);
        }
    }, [isChatVisible]);

    useEffect(() => {
        setMessages([]);

        if (userData?.Member_id && privateChatMember) {
            if (socket?.connected && privateChatMember.member_id >= '0') {
                socket.emit('privateMessages', {
                    member1_id: userData.Member_id,
                    member2_id: privateChatMember.member_id,
                    chat_type: chatType
                });
            }

            if (privateChatMember.member_id == '-1') {
                setMessages(notifications);
            }
        }

    }, [privateChatMember, notifications]);

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('privateMessages', (messageData: MessageInterface[]) => {
            setMessages(messageData.reverse());
        });

        socket.on('privateMessage', (messageData: MessageInterface) => {
            if (messageData.chat_type == 'PRIVATE') {
                socket.emit('privateMembers');
                socket.emit('unreadMessageCount');
            } else if (messageData.chat_type == 'CRUZ') {
                socket.emit('cruzChatList');
                socket.emit('unreadCruzMessageCount');
            }

            if (messageData.chat_type == chatType) {
                if (messageData.is_file) {
                    setShowLoader(false);
                }

                setMessages((messages) => {
                    return [...messages, messageData];
                });
            }
        });

        socket.on('loadMessages', (messageData: MessageInterface[]) => {
            setIsLoadMessage(true);

            if (messageData.length == 0) {
                setHasLoadMessage(false);
            }

            setMessages((oldMessages) => {
                return [...messageData.reverse(), ...oldMessages].filter((value, index, self) =>
                    index === self.findIndex((t) => t.message_id === value.message_id)
                ).sort((a: any, b: any) => a.message_id - b.message_id);
            });
        });

        socket.on('editPrivateMessage', ({ message_id, edited_text }) => {
            setMessages((prevMessages) => {
                return prevMessages.map(message =>
                    message.message_id === message_id
                        ? { ...message, message: edited_text } : message
                );
            });
        });

        socket.on('deletePrivateMessage', (message_id: string) => {
            setMessages((prevMessages) => {
                return prevMessages.filter(message => message.message_id != message_id);
            });

            socket.emit('privateMembers');
        });

        socket.on('addPrivateReaction', (reaction: ReactionInterface) => {
            addReaction(reaction);
        });

        socket.on('removePrivateReaction', (reaction: ReactionInterface) => {
            removeReaction(reaction);
        });

        socket.on('loadPrivateReactions', (reactions: ReactionInterface[]) => {
            reactions.map((reaction: ReactionInterface) => {
                addReaction(reaction);
            });
        });

        socket.on('reportMessage', (data) => {
            console.log(data, 'data');
            setMessages((prevMessages) => {
                return prevMessages.map(message =>
                    message.message_id === data.message_id
                        ? { ...message, is_reported: data.is_reported, reported_reason: data.report_reason } : message
                );
            });
        });

        return () => {
            socket.off('privateMessages');
            socket.off('privateMessage');
            socket.off('loadMessages');
            socket.off('editPrivateMessage');
            socket.off('deletePrivateMessage');
            socket.off('addPrivateReaction');
            socket.off('removePrivateReaction');
            socket.off('loadPrivateReactions');
            socket.off('reportMessage');
        }
    }, [socket, chatType]);

    const addReaction = (reaction: ReactionInterface) => {
        setReactions((preValue) => {
            const newValue = { ...preValue };

            if (!newValue[reaction.message_id]) {
                newValue[reaction.message_id] = {};
            }

            if (!newValue[reaction.message_id][reaction.emoji_id]) {
                newValue[reaction.message_id][reaction.emoji_id] = [];
            }

            newValue[reaction.message_id][reaction.emoji_id].push(reaction);
            return newValue;
        });
    };

    const removeReaction = (reaction: ReactionInterface) => {
        setReactions((preValue) => {
            const newValue = { ...preValue };
            newValue[reaction.message_id][reaction.emoji_id] = newValue[reaction.message_id][reaction.emoji_id]?.filter(reactionValue => reactionValue.id != reaction.id);
            return newValue;
        });
    };

    const defaultLocale = 'en-US';

    const formatTime = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        return date.toLocaleTimeString(defaultLocale, options).toLowerCase();
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };

        return date.toLocaleDateString(defaultLocale, options);
    };

    const formatDateTime = (date: Date): string => {
        return `${formatTime(date)} - ${formatDate(date)}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleScroll = () => {
        if (messagesContainerRef.current?.scrollTop == 0 && hasLoadMessage && socket) {
            socket.emit('loadMessages', {
                offset: messages.length,
                member1_id: userData?.Member_id,
                member2_id: privateChatMember?.member_id,
                chat_type: chatType
            });

            messagesContainerRef.current.scrollTop += 10;
        }

        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;

            if (scrollToBottomRef.current) {
                if (scrollTop + clientHeight + 200 < scrollHeight) {
                    scrollToBottomRef.current.style.display = '';
                } else {
                    scrollToBottomRef.current.style.display = 'none';
                }
            }
        }
    };

    useEffect(() => {
        messageDate = '';

        if (isLoadMessage) {
            setIsLoadMessage(false);
        } else {
            scrollToBottom();
        }

        setReactions({});
        const messageIds = messages.map(message => message.message_id);
        socket?.emit('loadPrivateReactions', messageIds);
    }, [messages]);

    let messageDate = '';
    const renderDivider = (timestamp: string) => {
        const date = new Date(timestamp);
        const dateString = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/ /g, ' ');

        if (dateString != messageDate) {
            const prepend = (messageDate == '' && privateChatMember && privateChatMember?.member_id >= '0') ? 'Conversation started on ' : '';
            messageDate = dateString;
            return (
                <div className="mb-1 date-header d-flex align-items-center justify-content-between">
                    <label className="my-3">{prepend + messageDate}</label>
                </div>
            );
        }

        return ('');
    }

    // const joinMeeting = (meetingUrl: string) => {
    //     window.open(meetingUrl, '_blank');
    // };

    const downloadFile = (name: string, file: string | null) => {
        if (!file) return;

        axios.post(`${socketUrl}/download`, { file: file }, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }).catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];

    const replaceEmojis = (text: string): string => {
        return twemoji.parse(text, {
            folder: 'emoji',
            ext: '.png',
            base: socketUrl + '/',
        });
    };

    const replaceImgToEmojis = (message: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = message;
        const images = tempDiv.getElementsByTagName('img');
        const imgArray = Array.from(images);

        imgArray.reverse().forEach(imgNode => {
            const altText = imgNode.alt;
            const textNode = document.createTextNode(altText);
            imgNode.parentNode?.replaceChild(textNode, imgNode);
        });

        return tempDiv.innerHTML;
    };

    const getFormattedMessage = (message: MessageInterface) => {
        let html;

        if (message.is_file) {
            const fileExtension = message.message.split('.').pop()?.toLowerCase();

            if (fileExtension) {
                if (imageExtensions.includes(fileExtension)) {
                    html = (
                        <div className="uplod-img-box cursor-pointer" onClick={() => setOpenedImage(message)}>
                            <img src={`${socketUrl}/private/file/${message.message_id}`} alt="image" />
                        </div>
                    );
                } else if (videoExtensions.includes(fileExtension)) {
                    html = (
                        <div className="uplod-video-box cursor-pointer">
                            <video width="100%" controls>
                                <source src={`${socketUrl}/private/stream/${message.message_id}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    );
                } else {
                    html = (
                        <div className="d-flex align-items-center">
                            <div className="me-2">
                                <FontAwesomeIcon icon={faFile} style={{ fontSize: '25px' }} />
                            </div>
                            <div>{message.message}</div>
                        </div>
                    );
                }
            }
        } else if (message.sender_id == '0') {
            const parsedMarkdown = renderToString(<Markdown>{message.message}</Markdown>);
            html = (<div className="message-content" dangerouslySetInnerHTML={{ __html: parsedMarkdown }} />);
        } else {
            if (!message.emoji_replaced) {
                message.message = replaceEmojis(message.message);
                message.emoji_replaced = true;
            }

            html = (<div className="message-content" dangerouslySetInnerHTML={{ __html: message.message }} />);
        }

        if(message.is_reported === 1){
            html = (<div className='reported-msg-container'><span className="first-text">Sorry!</span><span className="sec-text"> You can't view this message.</span></div>); 
        }

        const emojiOnly: boolean = message.message.replace(/<img[^>]*\/?>|<\/img>/gi, '').trim() == '' && (message.message.match(/<img[^>]*\/?>/gi)?.length || 0) <= 3;

        return (
            <div>
                <div ref={(element) => messageRefs.current[message.message_id] = element} className={`position-relative d-flex align-items-center${emojiOnly ? ' emoji-only' : ''}`}>
                    <div className="message-box position-relative w-100">
                        <div className={message.sender_id == userData?.Member_id ? "messagereply-text" : "messageshell-text"}>
                            {message.reply_of_message_id && <div className="reply-actions cursor-pointer" onClick={() => { if (message.reply_of_message_id) scrollToMessage(message.reply_of_message_id) }}>
                                <div className="reply-chat">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="replay-text">Replying to:</span>
                                    </div>
                                    <div className="main-text">
                                        <h5>{message.reply_of_sender_id == userData?.Member_id ? 'You' : `${privateChatMember?.member_fname} ${privateChatMember?.member_lname}`}</h5>
                                    </div>
                                    <div className="input-reply-chat">{message.reply_of_message}</div>
                                </div>
                            </div>}
                            <Dropdown className={(privateChatMember && privateChatMember?.member_id == '0'  && message.sender_id == userData?.Member_id) || (privateChatMember?.member_id == '-1') || (message.is_reported == 1) ? "d-none" : "PvtMenuBtn"} isOpen={true} toggle={() => false}>
                                <DropdownToggle style={{ zIndex: 10 }} className="icon-arrow cursor-pointer" onClick={() => setSelectedMessage(message)}><FontAwesomeIcon icon={faAngleRight} /></DropdownToggle>
                                {selectedMessage?.message_id == message.message_id &&
                                    <DropdownMenu>
                                        {privateChatMember && privateChatMember?.member_id > '0' && (
                                            <>
                                                {message.is_file ?
                                                    <DropdownItem onClick={() => downloadFile(message.message, message.file_path)}><span><FontAwesomeIcon icon={faDownload} /></span>Download</DropdownItem> :
                                                    message.sender_id == userData?.Member_id &&
                                                    <DropdownItem onClick={() => handleEdit(message)}><span><FontAwesomeIcon icon={faEdit} /></span>Edit</DropdownItem>
                                                }
                                                {message.sender_id == userData?.Member_id &&
                                                    <DropdownItem onClick={() => handleDelete(message)}><span><FontAwesomeIcon icon={faTrash} /></span>Delete</DropdownItem>
                                                }
                                                <DropdownItem onClick={() => handleReply(message)}><span><FontAwesomeIcon icon={faReply} /></span>Reply</DropdownItem>
                                            </>
                                        )}
                                        {message.sender_id !== userData?.Member_id && (
                                            <DropdownItem onClick={handleMessageReport}><span><FontAwesomeIcon icon={faThumbsDown} /></span>Report</DropdownItem>
                                        )}
                                    </DropdownMenu>
                                }
                            </Dropdown>
                            {html}
                            <div className="updatestime d-md-none d-sm-block">
                                <span>{formatTime(new Date(message.timestamp))}</span>
                            </div>
                        </div>
                        <div className="time d-sm-none">{formatTime(new Date(message.timestamp))}</div>
                        {message.is_reported !== 1 && 
                            <div className={Object.values(reactions[message.message_id] ?? {}).some(reactionArray => reactionArray.length > 0) && privateChatMember && privateChatMember?.member_id > '0' ? "reaction-post" : "d-none"}>
                                {privateChatMember && privateChatMember?.member_id > '0' &&
                                    Object.entries(reactions[message.message_id] ?? {}).map(([emoji_id, reactions]) => {
                                        const reaction: ReactionInterface = reactions[0] ?? null;

                                        return (
                                            <>
                                                {reactions.length > 0 ? (
                                                    <div key={reaction?.id} onClick={() => setReactionMessageId(message.message_id)} className="cursor-pointer reaction-details">
                                                        <span><img alt={reaction?.reaction} draggable="false" src={`${socketUrl}/emoji/${emoji_id}.png`} style={{ width: '18px' }} /></span>
                                                        <label className="count">{reactions.length}</label>
                                                    </div>
                                                ) : ''}
                                            </>
                                        );
                                    })
                                }
                                {reactionMessageId == message.message_id && (
                                    <div className="list-wrapper">
                                        <div className="list-area">
                                            <ul>
                                                {
                                                    Object.entries(reactions[message.message_id] ?? {}).map(([emoji_id, reactions]) => {
                                                        return reactions.map((reaction: ReactionInterface) => {
                                                            const profilePic = (reaction.member_id == userData?.Member_id) ? userData.members_profile_picture : (privateChatMember?.member_profile_picture ? `${baseUrl}/${privateChatMember.member_profile_picture}` : require("../../../../assets/images/profile/Default.jpg"));

                                                            return (
                                                                <li className="align-items-center d-flex">
                                                                    <span>
                                                                        <img src={profilePic} alt="" />
                                                                    </span>
                                                                    <div className="d-flex align-items details-tags">
                                                                        <label>{reaction.member_id == userData?.Member_id ? 'You' : `${privateChatMember?.member_fname} ${privateChatMember?.member_lname}`}</label>
                                                                        <span dangerouslySetInnerHTML={{ __html: replaceEmojis(reaction.reaction) }} />
                                                                    </div>
                                                                </li>
                                                            )
                                                        });
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>

                </div>
                {message.is_reported !== 1 &&
                    <div className={privateChatMember && privateChatMember.member_id > '0' ? "smile-outer cursor-pointer" : "d-none"} onClick={() => handleClickReactionButton(message)}>
                        <img src={smileOuter} alt="Smiley" />
                    </div>
                }
            </div >
        );
    };

    useEffect(() => {
        document.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (!target.closest('.PvtMenuBtn')) {
                setSelectedMessage(undefined);
            }

            if (!target.closest('.smile-outer')) {
                setEmojiMessageId(undefined);
            }

            if (!target.closest('.reaction-details')) {
                setReactionMessageId(undefined);
            }
        });
    }, []);

    const deleteMessage = (messageId: string) => {
        socket?.emit('deletePrivateMessage', {
            receiver_id: privateChatMember?.member_id,
            message_id: messageId
        });
    };

    const handleEdit = (message: MessageInterface) => {
        setReplyMessage(undefined);
        setEditMessage({ ...message, message: replaceImgToEmojis(message.message) });
        setSelectedMessage(undefined);
        setIsLoadMessage(true);
    };

    const handleMessageReport = () => {
        Swal.fire({
            title: "Report Message",
            html: `
                <p>Thanks for your feedback .Let us know what's wrong so we can train and improve AI chats</p>
                <div style="text-align: left; margin-top: 10px;">
                    <div class="checkbox-container">
                        <label>
                            <input type="radio" name="feedback" id="not-relevant-checkbox" style="margin-right: 5px;" value="Not relevant" />
                            Not relevant
                        </label>
                    </div>
                    <div class="checkbox-container">
                        <label>
                            <input type="radio" name="feedback" id="harmful-checkbox" style="margin-right: 5px;" value="Harmful or offensive" />
                            Harmful or offensive
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

                const notRelevantCheckbox = document.getElementById('not-relevant-checkbox') as HTMLInputElement;
                const harmfulCheckbox = document.getElementById('harmful-checkbox') as HTMLInputElement;
                if (!notRelevantCheckbox.checked && !harmfulCheckbox.checked) {
                    Swal.showValidationMessage('You must select at least one reason to report the message.');
                    return false;
                }

                const selectedReason = document.querySelector(
                    'input[name="feedback"]:checked'
                ) as HTMLInputElement;

                socket?.emit('reportMessage', {
                    message_id: selectedMessage?.message_id,
                    receiver: privateChatMember?.member_id,
                    is_reported: 1,
                    reported_reason: selectedReason.value,
                });
                return;
            }
        });

        setSelectedMessage(undefined);
    };

    const handleDelete = (message: MessageInterface) => {
        Swal.fire({
            title: "Delete Message",
            html: "<p>Are you sure you want to delete this message?</p>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            target: '#Message-area-outer',
            customClass: {
                container: 'delete-message-swal',
            },
            preConfirm: () => {
                return new Promise<void>((resolve) => {
                    deleteMessage(message?.message_id);
                    resolve();
                });
            }
        })
        setSelectedMessage(undefined);
    };

    const handleReply = (message: MessageInterface) => {
        setEditMessage(undefined);
        setReplyMessage({ ...message, message: replaceImgToEmojis(message.message) });
        setSelectedMessage(undefined);
    };

    const handleClickReactionButton = (message: MessageInterface) => {
        setEmojiMessageId(emojiMessageId == undefined ? message.message_id : undefined);
    };

    const handleReactionClick = (emojiData: EmojiClickData) => {
        if (socket?.connected && emojiData.emoji && emojiData.unified) {
            socket.emit('privateReaction', {
                receiver_id: privateChatMember?.member_id,
                message_id: emojiMessageId,
                reaction: emojiData.emoji,
                emoji_id: emojiData.unified
            });

            setEmojiMessageId(undefined);
        }
    };

    const scrollToMessage = (message_id: string) => {
        if (messagesContainerRef.current) {
            const element = messageRefs.current[message_id];

            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (socket?.connected && messages.length > 0 && hasLoadMessage) {
                    socket.emit('loadPrivateMessagesUntilMessageId', {
                        message_id: message_id,
                        offset: messages.length,
                        receiver_id: privateChatMember?.member_id,
                        chat_type: chatType
                    });
                }

                let scrollInterval = setInterval(() => {
                    const newElement = messageRefs.current[message_id];

                    if (newElement) {
                        newElement.scrollIntoView({ behavior: 'smooth' });
                        clearInterval(scrollInterval);
                    }
                }, 200);
            }
        }
    };

    const handleNotificationClick = (message: MessageInterface) => {
        if (message.sender_id == '-1') {
            if (message.url_keyword === "Interview") {
                navigate(`/cruz/notification`);
            }
            if (message.url_keyword === "Specialist") {
                navigate(`/profile`,
                    {
                        state: {
                            mainTab: "MyBookings",
                            tabActive: 'MyBookings1',
                        },
                    });
            }
            if (message.url_keyword === "Member") {
                navigate(`/profile`,
                    {
                        state: {
                            mainTab: 'MyBookings',
                            tabActive: "MyBookings2"
                        },
                    });
            }
            if (message.url_keyword === "Employee" || message.url_keyword === "Employee Match") {
                navigate(`/cruz/employerviewsjobs`,
                    {
                        state: {
                            employee_id: message?.employee_id,
                            job_ids: [message.job_id],
                            jobCount: 1,
                        },
                    });
            }
            if (message.url_keyword === "Job") {
                navigate(`/cruz/matchedprofile`,
                    {
                        state: {
                            employee_ids: [message.employee_id],
                            job_id: message.job_id,
                            employee_count: 1,
                        },
                    });
            }
            if (message.url_keyword === "Job Match") {
                const job_role = message.message.split('Job Role')[1];
                navigate(`/cruz/mymatches`, {
                    state: {
                        id: message.job_id,
                        job_role: job_role

                    }
                });
            }

            setIsChatVisible(false)
        }
    };

    return (
        <>
            <div id="Message-area-outer" className={`Message-area-outer ${privateChatMember?.is_blocked ? 'blocked-box' : ''}`} ref={messagesContainerRef} onScroll={handleScroll}>
                <div className={`messge-wrapper ${privateChatMember?.is_blocked ? 'messge-wrapper-block' : ''}`}>
                    <div className="message-area">
                        {
                            messages.map((message: MessageInterface) => {

                                return (
                                    <div key={message.message_id}>
                                        {renderDivider(message.timestamp)}
                                        {(message.sender_id == privateChatMember?.member_id) ? (
                                            <div className={`messageshell position-relative ${privateChatMember.member_id == '-1' && 'cursor-pointer'}`} onClick={() => handleNotificationClick(message)}>
                                                {getFormattedMessage(message)}
                                                <div className="emoji-text">
                                                    {emojiMessageId == message.message_id && <EmojiPicker className="private-chat-reactions" lazyLoadEmojis={true} allowExpandReactions={false} reactionsDefaultOpen={true} onReactionClick={handleReactionClick} />}
                                                </div>
                                                <div className="message-label d-flex align-items-center justify-content-between">
                                                    <div className="d-flex user">
                                                        <div className="user-img">
                                                            <img
                                                                src={privateChatMember?.member_profile_picture ? (privateChatMember.member_id <= '0' ? '' : baseUrl) + privateChatMember.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                                alt="Profile Image"
                                                            />
                                                        </div>
                                                        <div className="user-label">
                                                            <label>{`${privateChatMember?.member_fname} ${privateChatMember?.member_lname}`}</label>
                                                        </div>
                                                    </div>
                                                    <div className="date-wrapper ms-2">
                                                        {formatTime(new Date(message.timestamp))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (message.sender_id == userData?.Member_id && message.receiver_id == privateChatMember?.member_id) ? (
                                            <div className="messagereply">
                                                {getFormattedMessage(message)}
                                                <div className="emoji-text">
                                                    {emojiMessageId == message.message_id && <EmojiPicker className="private-chat-reactions" lazyLoadEmojis={true} allowExpandReactions={false} reactionsDefaultOpen={true} onReactionClick={handleReactionClick} />}
                                                </div>
                                                <div className="message-label d-flex align-items-center justify-content-between">
                                                    <div className="date-wrapper me-2">
                                                        {formatTime(new Date(message.timestamp))}
                                                    </div>
                                                    <div className="d-flex user">
                                                        <div className="user-img">
                                                            <img
                                                                src={userData?.members_profile_picture ? userData.members_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                                alt="Profile Image"
                                                            >
                                                            </img>
                                                        </div>
                                                        <div className="user-label">
                                                            <label>You</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : ''}
                                    </div>
                                );
                            })
                        }
                        {messages.length == 0 && 
                            <div className="mb-1 date-header d-flex align-items-center justify-content-between">
                                <label className="my-3">
                                    {privateChatMember?.member_id == '-1'? 'No notifications yet. Stay tuned for updates!' : 'No messages yet. Start a new conversation!'}
                                </label>
                            </div>
                        }
                        {privateChatMember?.is_blocked && (
                            <div className="block-template">
                                <div className="blocked-msg-box">
                                    <label className="blocked-msg-text p-0">You have blocked this member. Unblock to message.</label>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />

                    </div>
                    {replyMessage && <div className="reply-actions">
                        <div className="reply-chat">
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="replay-text">Replying to:</span>
                                <span className="close-button" onClick={() => setReplyMessage(undefined)}><a><FontAwesomeIcon icon={faClose} /></a></span>
                            </div>
                            <div className="main-text">
                                <h5>{replyMessage.sender_id == userData?.Member_id ? 'You' : `${privateChatMember?.member_fname} ${privateChatMember?.member_lname}`}</h5>
                            </div>
                            <div className="input-reply-chat">{replyMessage.message}</div>
                        </div>
                    </div>}
                    {editMessage && <div className="reply-actions Edit-Message">
                        <div className="reply-chat">
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="replay-text">Edit Message</span>
                                <span className="close-button" onClick={() => { setEditMessage(undefined); setIsLoadMessage(false); }}><a><FontAwesomeIcon icon={faClose} /></a></span>
                            </div>
                            <div className="input-reply-chat">{editMessage.message}</div>
                        </div>
                    </div>}
                </div>

            </div>
            <div ref={scrollToBottomRef} className="scroll-to-bottom cursor-pointer" style={{ display: 'none', bottom: privateChatMember?.member_id == '-1' ? '50px' : '' }} onClick={scrollToBottom}>
                <span><FontAwesomeIcon icon={faArrowDown} /></span>&nbsp; Scroll to bottom
            </div>
            <div>
                {openedImage &&
                    < Modal
                        isOpen={true} centered className="chat-viewModal chat-singleViewmodal">
                        <ModalBody>
                            <ModalHeader toggle={() => setOpenedImage(undefined)}>
                                <div className="me-2 cursor-pointer" onClick={() => downloadFile(openedImage.message, openedImage.file_path)}>
                                    <FontAwesomeIcon icon={faDownload} style={{ fontSize: '25px' }} />
                                </div>
                            </ModalHeader>
                            <div className="action-modal">
                                <img
                                    src={`${socketUrl}/private/file/${openedImage.message_id}`}
                                    alt="image"
                                    className="modal-image w-100 img-fluid"
                                />
                            </div>
                        </ModalBody>
                    </Modal >
                }
            </div>
            {/* <div className="reportModal">
                  <Modal
                     isOpen={isModalOpen}
                        centered
                        className="reportModal-view"
                         toggle={() => setIsModalOpen(false)}
                         
                        >
                        <ModalBody>
                            <ModalHeader toggle={closeModal} />
                            <div className="action-modal"></div>
                        </ModalBody>
                </Modal >
            </div> */}
        </>
    )
}

export default SingleChatMessage;