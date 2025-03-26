import { getUserData } from "../../../utils/Utils";
import { useEffect, useRef, useState } from "react";
import { MemberInterface, MessageInterface, RoomInterface, replyInterface } from "../../../types/GroupChatInterfaces";
import { ListMembers } from "./Components/ListMembers";
import { ListMessages } from "./Components/ListMessages";
import { ListRooms } from "./Components/ListRooms";
import { SendMessage } from "./Components/SendMessage";
import "../../../components/chatDesign/ChatDesign.scss";
import { useParams } from 'react-router-dom';
import { useSocket } from "../../../contexts/SocketContext";
import { MODAL_TYPES, useGlobalModalContext } from "../../../utils/GlobalModal";

const user = getUserData("userData");

const GroupChat = () => {
    const { roomId } = useParams();
    const room_id = Number(roomId);
    const [members, setMembers] = useState<MemberInterface[]>([]);
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [rooms, setRooms] = useState<RoomInterface[]>([]);
    const { socket, isConnected } = useSocket();
    const [replyTo, setReplyTo] = useState<replyInterface>();
    const handleSetReplyTo = (message: MessageInterface) => {
        const insertOfReplyTo: replyInterface = {
            reply_of_message_id: message.message_id,
            reply_of_member_id: message.member_id,
            reply_of_member_fname: message.member_fname,
            reply_of_member_lname: message.member_lname,
            reply_of_content: message.content,
            reply_of_file: message.file
        };

        setReplyTo(insertOfReplyTo);
    };
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const replyAreaRef = useRef<HTMLDivElement>(null);
    const chatAreaBlockRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(0);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
        if (chatAreaBlockRef.current) {
            chatAreaBlockRef.current.style.paddingBottom = `${height}px`;
        }
    }, [height]);

    useEffect(() => {
        setReplyTo(undefined);
    }, [room_id]);

    const [replyAreaHeight, setReplyAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (replyAreaRef.current) {
            setHeight(replyAreaRef.current.clientHeight);
        }

        const updateMaxHeight = () => {
            const windowHeight = window.innerHeight;
            const maxHeightValue = windowHeight - 300;
            setMaxHeight(maxHeightValue);
        };

        updateMaxHeight();
        window.addEventListener("resize", updateMaxHeight);

        return () => {
            window.removeEventListener("resize", updateMaxHeight);
        };
    }, []);

    useEffect(() => {
        if (socket?.connected) {
            socket.on('rooms', (rooms: RoomInterface[]) => {
                setRooms(rooms);
            });

            socket.on('roomMembers', (members: MemberInterface[]) => {
                setMembers(members.filter(member => member.member_id != user?.Member_id));
            });
        } else {
            setRooms([]);
            setMessages([]);
            setMembers([]);
            return;
        }

        return () => {
            socket.off('rooms');
            socket.off('roomMembers');
        };
    }, [isConnected]);

    const sendMessage = (message: string) => {
        message = message.replace(/\n+$/, '').trim();

        if (message && socket) {
            socket.emit("roomMessage", {
                room_id: room_id,
                message: message,
                reply_of: replyTo
            });

            setReplyTo(undefined);
        }
    };

    const deleteMessage = (message_id: string) => {
        if (socket) {
            socket.emit('deleteMessage', {
                room_id, message_id
            });
        }
    }

    const smallDeviceWidth = 767;
    const [showUsers, setShowUsers] = useState(window.innerWidth < smallDeviceWidth ? false : true);
    const handleshowUsers = () => {
        if (window.innerWidth < smallDeviceWidth) {
            setShowUsers(!showUsers);
        }
    }

    useEffect(() => {
        let overlayDiv: HTMLDivElement | null;

        if (window.location.pathname === `/group-chat/${roomId}`) {
            if (window.innerWidth < smallDeviceWidth) {
                if (showUsers) {
                    document.body.classList.add('blur-bg');
                    overlayDiv = document.createElement('div');
                    overlayDiv.className = 'overlay';
                    document.body.insertAdjacentElement('afterbegin', overlayDiv);
                    overlayDiv?.addEventListener('click', handleshowUsers);
                } else {
                    document.body.classList.remove('blur-bg');
                    overlayDiv = document.querySelector('.overlay');
                    if (overlayDiv) {
                        overlayDiv.remove();
                    }
                }
            }
        }
        else {
            overlayDiv = document.querySelector('.overlay');

            if (overlayDiv) {
                overlayDiv.remove();
            }
        }
    }, [showUsers]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [isReplyClicked, setIsReplyClicked] = useState<boolean>(false);

    const { showModal } = useGlobalModalContext();

    useEffect(() => {
        const memberType = user?.Member_type;

        if (!memberType) {
            showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
        }
    }, []);

    return (
        <div className="chat-container">
            <div className="container-fluid">
                <div className="row">
                    <ListMembers toggleList={showUsers} members={members} />
                    <div className="chat-block-wrapper">
                        <div className="chat-block">
                            <ListRooms setShowLoader={setShowLoader} messages={messages} setMessages={setMessages} roomId={String(room_id)} rooms={rooms} members={members} handleshowUsers={handleshowUsers} />
                            <div className="chat-section-wrap">
                                <ListMessages replyAreaHeight={replyAreaHeight} showLoader={showLoader} setShowLoader={setShowLoader} setIsReplyClicked={setIsReplyClicked} roomId={room_id} setMessages={setMessages} maxHeight={maxHeight} chatAreaBlockRef={chatAreaBlockRef} messages={messages} deleteMessage={deleteMessage} handleSetReplyTo={handleSetReplyTo} />
                                <SendMessage setReplyAreaHeight={setReplyAreaHeight} setShowLoader={setShowLoader} setIsReplyClicked={setIsReplyClicked} isReplyClicked={isReplyClicked} roomId={room_id} replyAreaRef={replyAreaRef} sendTextMessage={sendMessage} replyTo={replyTo} setReplyTo={setReplyTo} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupChat;
