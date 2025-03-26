import { MessageInterface, ReactionInteface } from "../../../../types/GroupChatInterfaces";
import "../../../../components/chatDesign/ChatDesign.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload, faEdit, faEllipsis, faFile, faLongArrowAltDown, faReply, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import { getUserData } from "../../../../utils/Utils";
import { MODAL_TYPES, useGlobalModalContext } from "../../../../utils/GlobalModal";
import React from "react";
import { useSocket } from "../../../../contexts/SocketContext";
import axios from 'axios';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useNavigate } from 'react-router-dom';
import twemoji from "twemoji";

interface Props {
    messages: MessageInterface[];
    deleteMessage: (message_id: string) => void;
    handleSetReplyTo: (message: MessageInterface) => void;
    chatAreaBlockRef: React.MutableRefObject<any>;
    maxHeight: number;
    setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>;
    roomId: number;
    setIsReplyClicked: React.Dispatch<React.SetStateAction<boolean>>;
    showLoader: boolean;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    replyAreaHeight: number;
}

const user = getUserData("userData");
const socketUrl: string = process.env.REACT_APP_SOCKET_URL as string;
const baseUrl: string = process.env.REACT_APP_STORAGE_URL as string;

export const ListMessages = ({ replyAreaHeight, showLoader, setShowLoader, setIsReplyClicked, roomId, handleSetReplyTo, chatAreaBlockRef, maxHeight }: Props) => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { showModal } = useGlobalModalContext();

    const chatAreaInner = useRef<HTMLDivElement>(null);
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<MessageInterface>();
    const [pinnedMessage, setPinnedMessage] = useState<MessageInterface>();
    const [hasLoadMessages, setHasLoadMessages] = useState<boolean>(true);
    const [isLoadMessages, setIsLoadMessages] = useState<boolean>(false);
    const [isModerator, setIsModerator] = useState<boolean>(false);
    const [showEditReactionMsgId, setShowEditReactionMsgId] = useState<string>();
    const [emojiMessageId, setEmojiMessageId] = useState<string>();
    const [reactions, setReactions] = useState<ReactionsState>({});
    const [selectedReactionId, setSelectedReactionId] = useState<string>();
    const [openedImage, setOpenedImage] = useState<MessageInterface>();
    interface ReactionsState {
        [messageId: string]: { [emojiId: string]: ReactionInteface[] };
    }

    const editMessage = (message_id: string, edited_text: string) => {
        if (socket?.connected && edited_text.trim() != '') {
            socket.emit('editMessage', {
                room_id: roomId, message_id, edited_text
            });
        }
    }

    const deleteMessage = (message_id: string) => {
        if (socket) {
            socket.emit('deleteMessage', {
                room_id: roomId, message_id
            });
        }
    }

    const showDeleteMessageModal = (messageId: string) => {
        showModal(MODAL_TYPES.CONFIRM_MODAL, {
            title: "Delete Message",
            details: "Are you sure you want to delete message?",
            confirmBtn: "DeleteMessage",
            messageId: messageId,
            deleteMessage: (messageId: string) => {
                deleteMessage(messageId);
            }
        });
        setSelectedMessage(undefined);
    };

    useEffect(() => {
        if (chatAreaInner.current) {
            chatAreaInner.current.style.maxHeight = `${window.innerHeight - 300}px`;
        }
    }, []);

    useEffect(() => {
        setShowLoader(true);

        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.style.display = 'none';
        }
    }, [roomId]);

    const scrollToMessage = (message_id: string) => {
        if (chatAreaInner.current) {
            const element = messageRefs.current[message_id];

            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (socket?.connected && messages.length > 0 && hasLoadMessages) {
                    setShowLoader(true);
                    setIsLoadMessages(true);
                    socket.emit('loadRoomMessagesUntilMessageId', {
                        message_id: message_id,
                        offset: messages.length,
                        room_id: roomId
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

    const handlePinMessage = (message: MessageInterface) => {
        if (message == pinnedMessage) {
            handleUnpinMessage();
        } else {
            if (socket?.connected) {
                socket.emit('pinRoomMessage', { room_id: roomId, message_id: message.message_id });
            }

            setPinnedMessage(message);
        }
    };

    const handleUnpinMessage = () => {
        if (socket?.connected) {
            socket.emit('unpinRoomMessages', { room_id: roomId });
        }
    };

    const handleMessageScroll = () => {
        if (chatAreaInner.current) {
            const { scrollTop, clientHeight, scrollHeight } = chatAreaInner.current;

            if (socket?.connected && scrollTop <= 0 && hasLoadMessages && !isLoadMessages) {
                setShowLoader(true);
                setIsLoadMessages(true);
                socket.emit('loadRoomMessages', {
                    offset: messages.length,
                    room_id: roomId
                });

                chatAreaInner.current.scrollTop = 20;
            }

            if (scrollToBottomRef.current) {
                if (scrollTop + clientHeight + 200 < scrollHeight) {
                    scrollToBottomRef.current.style.display = 'block';
                } else {
                    scrollToBottomRef.current.style.display = 'none';
                }
            }
        }
    };

    useEffect(() => {
        if (!socket?.connected) return;

        socket?.emit("joinRoom", { member_id: user?.Member_id, room_id: roomId });

        socket.on('loadRoomMessages', (messageData: MessageInterface[]) => {
            setShowLoader(false);
            setIsLoadMessages(false);

            if (messageData.length == 0) {
                setHasLoadMessages(false);
                return;
            } else {
                setHasLoadMessages(true);
            }

            setMessages((prevMessages) => {
                return [...messageData.reverse(), ...prevMessages]
                    .filter((message, index, self) =>
                        index === self.findIndex((msg) => msg.message_id == message.message_id))
                    .sort((a: any, b: any) => a.message_id - b.message_id);
            });

            loadReactions(messageData);

        });

        socket.on('pinnedRoomMessage', (pinnedMessage: MessageInterface) => {
            setPinnedMessage(pinnedMessage);
        });

        socket?.on('pinRoomMessage', (pinnedMsg) => {
            let messageId = pinnedMsg.message_id;
            if(messages){
                let message = messages.find((msg:MessageInterface)=> msg.message_id === messageId); 
                setPinnedMessage(message);
            }
		});

        socket.on('unpinRoomMessages', ({ room_id }) => {
            if (roomId == room_id) {
                setPinnedMessage(undefined);
            }
        });

        socket.on('roomModerator', (is_moderator: boolean) => {
            setIsModerator(is_moderator);
        });

        socket.on('reaction', (data: ReactionInteface) => {
            setReaction(data.message_id, data);
        });

        socket.on('loadReactions', (reactions: ReactionInteface[]) => {
            reactions.map(reaction => {
                setReaction(reaction.message_id, reaction);
            });
        });

        socket.on('removeReaction', (reaction: ReactionInteface) => {
            setReactions((prevReactions) => {
                const newReactions = { ...prevReactions };

                if (newReactions[reaction.message_id] && newReactions[reaction.message_id][reaction.emoji_id]) {
                    newReactions[reaction.message_id][reaction.emoji_id] = newReactions[reaction.message_id][reaction.emoji_id].filter(
                        (newReaction) => (newReaction.member_id != reaction.member_id)
                    );
                }

                return newReactions;
            });
        });

        socket.on('roomMessage', (message: MessageInterface) => {
            setMessages((prevMessages) => [...prevMessages, message]);

            setTimeout(() => {
                scrollToBottom();
            }, 100);
        });

        socket.on('roomMessages', (messages: MessageInterface[]) => {
            setShowLoader(false);

            if (messages.length == 0) {
                setHasLoadMessages(false);
            } else {
                setHasLoadMessages(true);
            }

            setMessages(messages.reverse());
            loadReactions(messages);

            setTimeout(() => {
                scrollToBottom();
            }, 200);
        });

        return () => {
            socket.off('loadRoomMessages');
            socket.off('pinnedRoomMessage');
            socket.off('unpinRoomMessages');
            socket.off('roomModerator');
            socket.off('reaction');
            socket.off('loadReactions');
            socket.off('removeReaction');
            socket.off('roomMessage');
            socket.off('roomMessages');
        };
    }, [socket, roomId]);

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

    const scrollToBottom = () => {
        if (chatAreaInner.current) {
            chatAreaInner.current.scrollTo({
                top: chatAreaInner.current.scrollHeight,
                behavior: 'auto'
            });

            setTimeout(() => {
                if (chatAreaInner.current) {
                    const { scrollTop, clientHeight, scrollHeight } = chatAreaInner.current;

                    if (scrollTop + clientHeight <= scrollHeight) {
                        chatAreaInner.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, 600);
        }
    };

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];

    const getFormattedMessage = (message: MessageInterface) => {
        let html;

        if (message.file) {
            const fileExtension = message.content.split('.').pop()?.toLowerCase();

            if (fileExtension) {
                if (imageExtensions.includes(fileExtension)) {
                    html = (
                        <div className="upload-img-box cursor-pointer" onClick={() => setOpenedImage(message)} onDoubleClick={() => downloadFile(message.content, message.file)}>
                            <img src={`${socketUrl}/group/file/${message.message_id}`} alt="image" />
                        </div>
                    );
                } else if (videoExtensions.includes(fileExtension)) {
                    html = (
                        <div className="upload-video-box">
                            <video width="100%" controls>
                                <source src={`${socketUrl}/group/stream/${message.message_id}`} type="video/mp4" />
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
                            <div>{message.content}</div>
                        </div>
                    );
                }
            }
        } else {
            if (!message.emoji_replaced) {
                message.content = replaceEmojis(message.content);
                message.emoji_replaced = true;
            }

            html = (
                <div
                    id={`chat_message_div_${message.message_id}`}
                    className="chat-input-text"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                />
            );
        }

        return (
            <div ref={(element) => messageRefs.current[message.message_id] = element}>
                {html}
            </div >
        );
    }

    const replaceEmojis = (text: string): string => {
        return twemoji.parse(text, {
            folder: 'emoji',
            ext: '.png',
            base: socketUrl + '/',
        });
    };

    const replaceImgToEmojis = (element: HTMLElement) => {
        const images = element.getElementsByTagName('img');

        for (let i = images.length - 1; i >= 0; i--) {
            const altText = images[i].alt;
            const imgNode = images[i];
            const textNode = document.createTextNode(altText);
            imgNode.parentNode?.replaceChild(textNode, imgNode);
        }
    };

    useEffect(() => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.style.bottom = `${replyAreaHeight}px`;
            scrollToBottomRef.current.style.marginTop = `-38px`;
        }
    }, [replyAreaHeight]);

    const handleSetEdit = (message: MessageInterface) => {
        const messageId = message.message_id;

        const messageElement = document.getElementById(`chat_message_div_${messageId}`);
        const button = document.getElementById(`chat_message_button_${messageId}`);
        const editButton = document.getElementById(`edit_${messageId}`);

        if (editButton) {
            editButton.classList.add('d-none');
        }

        if (messageElement) {
            replaceImgToEmojis(messageElement);
            messageElement.contentEditable = 'true';
            messageElement.focus();

            const range = document.createRange();
            const selection = window.getSelection();

            if (range && selection) {
                range.selectNodeContents(messageElement);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        if (button) {
            button.classList.remove('d-none');
        }
    };

    const handleResetEdit = (messageId: string, message: string | undefined = undefined) => {
        const messageElement = document.getElementById(`chat_message_div_${messageId}`);
        const button = document.getElementById(`chat_message_button_${messageId}`);
        const editButton = document.getElementById(`edit_${messageId}`);

        if (editButton) {
            editButton.classList.remove('d-none');
        }

        if (messageElement) {
            messageElement.contentEditable = 'false';
            const messageObject: MessageInterface | undefined = messages.find(message => message.message_id == messageId) ?? undefined;

            if (messageObject) {
                if (message) {
                    messageObject.content = message ?? messageObject.content;
                }

                messageElement.innerHTML = messageObject.content;
            }
        }

        if (button) {
            button.classList.add('d-none');
        }
    };

    const handleSaveEdit = (message: MessageInterface) => {
        const messageId = message.message_id;
        const messageElement = document.getElementById(`chat_message_div_${messageId}`);

        if (messageElement) {
            const editedText = messageElement.innerText;

            if (editedText.trim() != '') {
                editMessage(messageId, editedText);
                handleResetEdit(messageId, replaceEmojis(editedText));
            }
        }
    };

    const clickEditReaction = (messageId: string, emojiData: EmojiClickData) => {
        const messageElement = document.getElementById(`chat_message_div_${messageId}`);

        if (messageElement) {
            messageElement.innerText += emojiData.emoji;
        }
    };

    const handleReactionClick = (emojiData: EmojiClickData) => {
        if (socket?.connected && emojiData.emoji && emojiData.unified) {
            socket.emit('reaction', {
                room_id: roomId,
                message_id: emojiMessageId,
                reaction: emojiData.emoji,
                emoji_id: emojiData.unified
            });

            setEmojiMessageId(undefined);
        }
    };

    const handleSetEmojiMessageId = (message_id: string) => {
        if (emojiMessageId == message_id) {
            setEmojiMessageId(undefined);
        } else {
            setEmojiMessageId(message_id);
        }
    };

    const setReaction = (messageId: string, reaction: ReactionInteface) => {
        setReactions((prevReactions) => {
            const newReactions = { ...prevReactions };

            if (!newReactions[messageId]) {
                newReactions[messageId] = {};
            }

            if (!newReactions[messageId][reaction.emoji_id]) {
                newReactions[messageId][reaction.emoji_id] = [];
            }

            if (!newReactions[messageId][reaction.emoji_id].find((currentReaction) => currentReaction.reaction_id == reaction.reaction_id))
                newReactions[messageId][reaction.emoji_id].push(reaction);

            return newReactions;
        });
    };

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (emojiMessageId) {
                const emoji_picker = document.getElementById(`emoji_picker_${emojiMessageId}`);
                const emoji_picker_btn = document.getElementById(`emoji_picker_btn_${emojiMessageId}`);

                if (emoji_picker && emoji_picker_btn && !emoji_picker_btn.contains(event.target as Node) && !emoji_picker.contains(event.target as Node)) {
                    setEmojiMessageId(undefined);
                }
            }
        };

        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [emojiMessageId]);

    const loadReactions = (messages: MessageInterface[]) => {
        const messageIds = messages.map(message => message.message_id);

        if (socket?.connected) {
            socket.emit('loadReactions', messageIds);
        }
    };

    const handleSetShowEditReactionMsgId = (messageId: string) => {
        setShowEditReactionMsgId((preValue) => {
            return preValue == messageId ? undefined : messageId;
        });
    };

    const handleReactionDetails = (reactions: ReactionInteface[]) => {
        if (selectedReactionId) {
            setSelectedReactionId(undefined);
            return;
        }

        setSelectedReactionId(reactions[0].reaction_id);
    };

    document.addEventListener('click', function (event: MouseEvent) {
        const target = event.target as HTMLElement | null;

        if (target && !target.closest('.emoji-reactions')) {
            setSelectedReactionId(undefined);
        }

        if (target && !target.closest('.update-emoji')) {
            setShowEditReactionMsgId(undefined);
        }
    });

    let messageDate = '';

    return (
        <>
            <div
                className={`pin-message ${pinnedMessage ? '' : 'd-none'}`}
                onClick={() => pinnedMessage && scrollToMessage(pinnedMessage.message_id)}
            >
                <span className={`close-icon ${isModerator ? '' : 'd-none'}`}>
                    <FontAwesomeIcon icon={faClose} onClick={handleUnpinMessage} />
                </span>
                <div className="align-items-center d-flex message-block">
                    <span className="icon"><FontAwesomeIcon icon={faThumbTack} /></span>
                    <div className="pin-message-text" dangerouslySetInnerHTML={{ __html: pinnedMessage?.content ?? '' }} style={{ whiteSpace: "pre-line" }} />
                </div>
            </div>
            <div className={`chat-area-block ${pinnedMessage ? 'top-active' : ''}`} ref={chatAreaBlockRef}>
                <div className={`chat-laoder ${showLoader ? '' : 'd-none'}`}></div>
                <div className="container-fluid chat-area-inner" ref={chatAreaInner} onScroll={handleMessageScroll}>
                    {messages.length === 0 &&(
                        <div className="align-items-center text-center">
                            <p>
                                {'No messages yet. Start a new conversation!'}
                                </p>
                        </div>
                    )}
                    {
                        messages?.map((message) => {
                            const date = new Date(message.timestamp);
                            const timeString = date.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            });

                            const dateString = date.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            }).replace(/ /g, ' ');

                            return (
                                <div id={`message_div_${message.message_id}`} key={message.message_id}>
                                    {messageDate != dateString && (messageDate = dateString) && <div className="divider">
                                        <span>{dateString}</span>
                                    </div>}
                                    <div className={`chat-part flex-wrap ${message.member_id == user?.Member_id ? 'chat-reply d-flex' : 'd-lg-flex d-md-flex'}`}>
                                        <div className={message.member_id == user?.Member_id ? 'd-none' : 'pro-area-wrapper'}>
                                            <div className="pro-area">
                                                <div className="pro-img cursor-pointer" onClick={() => navigate(`/publicprofile`,
                                                    {
                                                        state: message.member_id,
                                                    })}>
                                                    <img
                                                        src={message.member_profile_picture ? baseUrl + message.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                        alt="Profile Image"
                                                    />
                                                </div>
                                                <label>
                                                    {message.member_fname} {message.member_lname}
                                                </label>
                                            </div>
                                            <span className="time d-lg-none d-md-none">
                                                {timeString}
                                            </span>
                                        </div>
                                        <div className={`right-area ${message.member_id == user?.Member_id ? 'order-1 order-md-0 order-lg-0 order-xl-0 order-xxl-0 d-md-flex d-block align-items-start new-updates-rightarea' : ' '}`}>
                                            <div className="profile-updates d-flex align-items-baseline justify-content-between">
                                                {/*  */}
                                                <div className={message.member_id == user?.Member_id ? 'pro-area-wrapper' : 'd-none'}>
                                                    <div className={`pro-area ${message.member_id == user?.Member_id ? 'order-0 order-md-1 order-lg-1 order-xl-1 order-xxl-1' : ''}`}>
                                                        <div className="pro-img cursor-pointer" onClick={() => navigate(`/publicprofile`,
                                                            {
                                                                state: message.member_id,
                                                            })}>
                                                            <img
                                                                src={message.member_profile_picture ? baseUrl + message.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                                alt="Profile Image"
                                                            />
                                                        </div>
                                                        <label>
                                                            {message.member_fname} {message.member_lname}
                                                        </label>
                                                    </div>
                                                    <span className="time d-lg-none d-md-none">
                                                        {timeString}
                                                    </span>
                                                </div>
                                                <div className="action-box-new new-updates">
                                                    {user?.Member_id == message.member_id && (
                                                        <>
                                                            <div>
                                                                {message.file ?
                                                                    (<div id={`download_${message.message_id}`} className="action-box icon-box icon-none" onClick={() => downloadFile(message.content, message.file)}>
                                                                        <span className="icon"><FontAwesomeIcon icon={faDownload} /></span>
                                                                    </div>) : (<div id={`edit_${message.message_id}`} className="action-box icon-box icon-none" onClick={() => handleSetEdit(message)}>
                                                                        <span className="icon"><FontAwesomeIcon icon={faEdit} /></span>
                                                                    </div>)
                                                                }
                                                                <div className="action-box icon-box icon-none" onClick={() => { showDeleteMessageModal(message.message_id) }}>
                                                                    <span className="icon"><FontAwesomeIcon icon={faTrashCan} /></span>
                                                                </div>
                                                            </div>
                                                            <div className={`reply-newypdates d-md-flex align-items-center d-sm-none justify-content-end flex-md-column ${user?.Member_id == message.member_id ? 'ms-0' : 'justify-content-end'}`}>
                                                                <div className="action-box" onClick={() => { handleSetReplyTo(message); setIsReplyClicked(true); }}>
                                                                    <span className="icon icon-replay"><FontAwesomeIcon icon={faReply} /></span>
                                                                </div>
                                                                <div id={`emoji_picker_btn_${message.message_id}`} className="action-box icon-box ms-0" onClick={() => handleSetEmojiMessageId(message.message_id)}>
                                                                    <div className="img-block">
                                                                        <img src={require("../../../../assets/images/chat/smile.png")} alt="Icons" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {/*  */}
                                            </div>
                                            <div className={`chat mx-2 w-100 ${(pinnedMessage?.message_id == message.message_id) ? 'pin' : ''}`}>
                                                {
                                                    message.reply_of ? (<div className="reply-chat" onClick={() => { if (message.reply_of) scrollToMessage(message.reply_of); }}>
                                                        <span>Replying to:</span>
                                                        {message.reply_of_file && (
                                                            <div className="file-download d-flex align-items-center">
                                                                <span className="upload-icon"><FontAwesomeIcon icon={faFile} /></span>
                                                                <span>{message.reply_of_content}</span>
                                                            </div>
                                                        )}
                                                        <h5>{`${message.reply_of_member_fname} ${message.reply_of_member_lname}`}</h5>
                                                        <div className="chat-replay-text" dangerouslySetInnerHTML={{ __html: (message.reply_of_content ?? '') }} style={{ whiteSpace: "pre-line" }} /></div>) : ''
                                                }
                                                {getFormattedMessage(message)}
                                                <div className="d-flex align-items-center justify-content-end mt-3">
                                                    {isModerator && (<span className={`icon-pin ${(pinnedMessage?.message_id == message.message_id) ? 'pin-active' : ''}`} onClick={() => handlePinMessage(message)}>
                                                        <FontAwesomeIcon icon={faThumbTack} />
                                                    </span>)}
                                                    <div id={`chat_message_button_${message.message_id}`} className="inner-action d-flex flex-fill d-none">
                                                        <div className="update-emoji me-1" onClick={() => handleSetShowEditReactionMsgId(message.message_id)}>
                                                            <img src={require("../../../../assets/images/chat/smile.png")} alt="Icons" />
                                                        </div>
                                                        {showEditReactionMsgId == message.message_id && <div id={`edit_reaction_${message.message_id}`} className="edit-emoji-actions">
                                                            <EmojiPicker lazyLoadEmojis={true} skinTonesDisabled={true} onEmojiClick={(emojiData: EmojiClickData) => clickEditReaction(message.message_id, emojiData)} />
                                                        </div>}
                                                        <button className="btn btn-cancel me-1" onClick={() => handleResetEdit(message.message_id)}>Cancel</button>
                                                        <button className="btn btn-update" onClick={() => handleSaveEdit(message)}>Update</button>
                                                    </div>
                                                    <span className="time flex-md-fill flex-lg-fill d-md-flex d-lg-flex justify-content-start">
                                                        {timeString}
                                                    </span>
                                                    <div className="emoji-reactions-outer d-flex">
                                                        {Object.keys(reactions[message.message_id] ?? [])?.map((emojiId) => (
                                                            reactions[message.message_id][emojiId].length > 0 && (<div className="emoji-reactions d-flex cursor-pointer" key={emojiId} onClick={() => handleReactionDetails(reactions[message.message_id][emojiId])}>
                                                                <span><img style={{ width: "18px" }} alt={reactions[message.message_id][emojiId][0]?.reaction ?? "emoji"} draggable="false" src={`${socketUrl}/emoji/${reactions[message.message_id][emojiId][0]?.emoji_id}.png`}></img></span>
                                                                <label className="ms-2">{reactions[message.message_id][emojiId].length}</label>
                                                                {selectedReactionId == reactions[message.message_id][emojiId][0].reaction_id && <div className="list-wrapper">
                                                                    <div className="list-area">
                                                                        <ul>
                                                                            {
                                                                                reactions[message.message_id][emojiId].map(reaction => {
                                                                                    return (
                                                                                        <li className="align-items-center d-flex" key={reaction.member_id}>
                                                                                            <span>
                                                                                                <img src={reaction.member_profile_picture ? baseUrl + reaction.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")} alt="Member Pic" />
                                                                                            </span>
                                                                                            <label>{user?.Member_id == reaction.member_id ? 'You' : `${reaction.member_fname} ${reaction.member_lname}`}</label>
                                                                                        </li>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </div>}
                                                            </div>)
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`action-area ms-2 d-flex align-items-end justify-content-end flex-md-column  ${user?.Member_id == message.member_id ? 'ms-0' : 'justify-content-end'}`}>
                                                <div className="action-box me-0" onClick={() => { handleSetReplyTo(message); setIsReplyClicked(true); }}>
                                                    <span className="icon icon-replay"><FontAwesomeIcon icon={faReply} /></span>
                                                    <label>Reply</label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    {message.file && <div id={`emoji_picker_btn_${message.message_id}`} className="action-box icon-box ms-2 me-1" onClick={() => downloadFile(message.content, message.file)}>
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <span className="icon icon-replay me-0 "><FontAwesomeIcon icon={faDownload} /></span>
                                                        </div>
                                                    </div>}
                                                    <div id={`emoji_picker_btn_${message.message_id}`} className="download-action action-box icon-box ms-0" onClick={() => handleSetEmojiMessageId(message.message_id)}>
                                                        <div className="img-block">
                                                            <img src={require("../../../../assets/images/chat/smile.png")} alt="Icons" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {user?.Member_id == message.member_id && (
                                                    <div className="action-box d-lg-none d-md-none icon-box" id="action" onClick={() => setSelectedMessage(message)}>
                                                        <span className="icon"><FontAwesomeIcon icon={faEllipsis} /></span>
                                                    </div>
                                                )}
                                                {/* {user?.Member_id == message.member_id && (
                                                    <>
                                                        {!message.file && (<div id={`edit_${message.message_id}`} className="action-box icon-box icon-none" onClick={() => handleSetEdit(message)}>
                                                            <span className="icon"><FontAwesomeIcon icon={faEdit} /></span>
                                                        </div>)}
                                                        <div className="action-box icon-box icon-none" onClick={() => { showDeleteMessageModal(message.message_id) }}>
                                                            <span className="icon"><FontAwesomeIcon icon={faTrashCan} /></span>
                                                        </div>
                                                        <div className="action-box d-lg-none d-md-none icon-box" id="action" onClick={() => setSelectedMessage(message)}>
                                                            <span className="icon"><FontAwesomeIcon icon={faEllipsis} /></span>
                                                        </div>
                                                    </>
                                                )} */}
                                            </div>
                                            <div className="e-picker-wrap">
                                                <div id={`emoji_picker_${message.message_id}`} className={emojiMessageId == message.message_id ? "" : "d-none"}>
                                                    <div className={message.member_id == user?.Member_id ? "d-flex justify-content-end d-md-flex e-picker justify-content-md-start mt-2" : "e-picker mt-2 d-flex justify-content-end"}>
                                                        {emojiMessageId == message.message_id && <EmojiPicker lazyLoadEmojis={false} allowExpandReactions={false} reactionsDefaultOpen={true} onReactionClick={handleReactionClick} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className={message.member_id == user?.Member_id ? 'pro-area-wrapper' : 'd-none'}>
                                            <div className={`pro-area ${message.member_id == user?.Member_id ? 'order-2 order-md-1 order-lg-1 order-xl-1 order-xxl-1' : ''}`}>
                                                <div className="pro-img cursor-pointer" onClick={() => navigate(`/publicProfile/${message.member_id}`)}>
                                                    <img
                                                        src={message.member_profile_picture ? baseUrl + message.member_profile_picture : require("../../../../../assets/images/profile/Default.jpg")}
                                                        alt="Profile Image"
                                                    />
                                                </div>
                                                <label>
                                                    {message.member_fname} {message.member_lname}
                                                </label>
                                            </div>
                                            <span className="time d-lg-none d-md-none">
                                                {timeString}
                                            </span>
                                        </div> */}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div ref={scrollToBottomRef} onClick={scrollToBottom} className="backtobottom cursor-pointer" style={{ display: 'none' }}>
                    <span><FontAwesomeIcon icon={faLongArrowAltDown} /></span> Scroll to Bottom
                </div>
                <Modal isOpen={selectedMessage ? true : false} toggle={() => setSelectedMessage(undefined)} centered className="action-modal-container">
                    <ModalBody>
                        <ModalHeader />
                        <div className="action-modal">
                            <h5>My Post</h5>
                            {!selectedMessage?.file && (<a onClick={() => { if (selectedMessage) { handleSetEdit(selectedMessage); setSelectedMessage(undefined); } }}><span><FontAwesomeIcon icon={faEdit} /></span>Edit Post</a>)}
                            <a onClick={() => { if (selectedMessage) { showDeleteMessageModal(selectedMessage.message_id) } }}><span><FontAwesomeIcon icon={faTrashCan} /></span>Delete Post</a>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                {openedImage &&
                    < Modal
                        isOpen={true} centered className="chat-viewModal">
                        <ModalBody>
                            <ModalHeader toggle={() => setOpenedImage(undefined)}>
                                <div className="me-2 cursor-pointer" onClick={() => downloadFile(openedImage.content, openedImage.file)}>
                                    <FontAwesomeIcon icon={faDownload} style={{ fontSize: '25px' }} />
                                </div>
                            </ModalHeader>
                            <div className="action-modal">
                                <img
                                    src={`${socketUrl}/group/file/${openedImage.message_id}`}
                                    alt="image"
                                    className="modal-image w-100 img-fluid"
                                />
                            </div>
                        </ModalBody>
                    </Modal >
                }
            </div>
        </>
    );
}
