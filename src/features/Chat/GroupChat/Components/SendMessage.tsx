import "../../../../components/chatDesign/ChatDesign.scss";
import { useEffect, useRef, useState } from "react";
import { MemberInterface, replyInterface } from "../../../../types/GroupChatInterfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../../../../contexts/SocketContext";
import { getUserData } from "../../../../utils/Utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Props {
    sendTextMessage: (message: string) => void;
    replyTo: replyInterface | undefined;
    setReplyTo: React.Dispatch<React.SetStateAction<replyInterface | undefined>>
    replyAreaRef: React.MutableRefObject<any>;
    roomId: number;
    isReplyClicked: boolean;
    setIsReplyClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setReplyAreaHeight: React.Dispatch<React.SetStateAction<number>>;
}

const socketUrl: string = process.env.REACT_APP_SOCKET_URL as string;

export const SendMessage: React.FC<Props> = ({ setReplyAreaHeight, setShowLoader, setIsReplyClicked, isReplyClicked, roomId, sendTextMessage, setReplyTo, replyTo, replyAreaRef }) => {
    const { socket, isConnected } = useSocket();
    const user = getUserData("userData");
    const [showEmoji, setShowEmoji] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const sendData = () => {
        if (inputDiv.current) {
            const message = inputDiv.current.innerText;

            if (message != '') {
                sendTextMessage(message);
                inputDiv.current.innerHTML = '';
            }
        }
    };

    const handleTextInputKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                event.preventDefault();
                sendData();
            }
        }

        clearTimeout(typingTimeout);

        if (socket?.connected) {
            socket.emit('roomTyping', { room_id: roomId });
        }
    };

    const [typingMember, setTypingMember] = useState<MemberInterface>();

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('roomTyping', (typingMember: MemberInterface) => {
            if (user?.Member_id != typingMember.member_id) {
                setTypingMember(typingMember);
            }
        });

        socket.on('stopRoomTyping', (typingMember: MemberInterface) => {
            setTypingMember(undefined);
        });
    }, [isConnected, user]);

    let typingTimeout: any;

    const handleTextInputKeyUp = () => {
        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
            if (socket?.connected) {
                socket.emit('stopRoomTyping', { room_id: roomId });
            }
        }, 500);
    };

    useEffect(() => {
        if (inputDiv.current) {
            inputDiv.current.focus();
        }
    }, [isReplyClicked]);

    useEffect(() => {
        if (inputDiv.current) {
            inputDiv.current.innerHTML = '';
            inputDiv.current.focus();
        }
    }, [roomId]);

    const sendFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowLoader(true);

        if (socket?.connected) {
            const files = event.target.files;

            if (files && files.length > 0) {
                const filesData: any[] = [];

                Array.from(files).forEach((file) => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        filesData.push({ file_data: reader.result, original_name: file.name });

                        if (filesData.length === files.length) {
                            socket.emit('roomFiles', { 
                                filesData: filesData, 
                                data: { 
                                    room_id: roomId, 
                                    reply_of: replyTo || null 
                                } 
                            });
                        }
                    };

                    setReplyTo(undefined)
                    reader.readAsArrayBuffer(file);
                });
            }
        }
    };

    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    const pickerButtonRef = useRef<HTMLDivElement | null>(null);

    document.addEventListener('mousedown', (event: MouseEvent) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
            setShowEmoji(false);
        }
    });

    const handleShowPicker = () => {
        if (pickerButtonRef.current && emojiPickerRef.current) {
            const buttonRect = pickerButtonRef.current.getBoundingClientRect();

            if ((buttonRect.bottom + 300) > window.innerHeight) {
                emojiPickerRef.current.style.bottom = '35px';
                emojiPickerRef.current.style.top = 'inherit';
            } else {
                emojiPickerRef.current.style.bottom = 'inherit';
                emojiPickerRef.current.style.top = '35px';
            }
        }

        setShowEmoji(true);
    };

    const inputDiv = useRef<HTMLDivElement>(null);

    const selectEmoji = (emojiData: EmojiClickData) => {
        // const data = `<img alt="${emojiData.emoji}" draggable="false" src="${socketUrl}/emoji/${emojiData.unified}"></img>`;
        const data = emojiData.emoji;

        if (inputDiv.current) {
            inputDiv.current.innerHTML = inputDiv.current.innerHTML + data;
        }
    };

    useEffect(() => {
        if (replyAreaRef.current) {
            setReplyAreaHeight(replyAreaRef.current.clientHeight);
        }
    }, []);

    return (
        <div className="replay-area" ref={replyAreaRef}>
            <div className="typping-msg mb-2">{typingMember ? `${typingMember.member_fname} ${typingMember.member_lname} is typing...` : ''}</div>
            <div className="replay-box">
                <div className={replyTo ? "reply-chat" : 'd-none'}>
                    <span className="close-button" onClick={() => { setReplyTo(undefined); setIsReplyClicked(preValue => !preValue); }}><a><FontAwesomeIcon icon={faClose} /></a></span>
                    <span>Replying to:</span>
                    <h5>{replyTo?.reply_of_member_fname} {replyTo?.reply_of_member_lname}</h5>
                    <div className="input-reply-chat" dangerouslySetInnerHTML={{ __html: (replyTo?.reply_of_content ?? '') }}></div>
                </div>
                <div
                    ref={inputDiv}
                    className="input-reply-area"
                    contentEditable
                    onKeyDown={handleTextInputKeyDown}
                    onKeyUp={handleTextInputKeyUp}
                />
                <div className="replay-action d-flex align-items-center justify-content-between">
                    <div className="left-blok d-flex">
                        <div className="upload-file cursor-pointer">
                            <div className="align-items-center d-flex">
                                <input ref={inputFileRef} type="file" id="file_input" accept="image/*,video/*,.pdf,.doc,.docx,.txt,.ppt,.xls,.csv" onClick={() => { if (inputFileRef.current) inputFileRef.current.value = '' }} multiple onChange={sendFiles} />
                                <span><FontAwesomeIcon icon={faPlus} /></span>
                                <label htmlFor="file_input">Upload Image</label>
                            </div>
                        </div>
                        <div className="action-outer">
                            <div className="action-smile" onClick={handleShowPicker} ref={pickerButtonRef}>
                                <img src={require("../../../../assets/images/chat/smile.png")} alt="Emoji" />
                            </div>
                            <div className={showEmoji ? "smile-outer" : "d-none"} ref={emojiPickerRef}>
                                <div className="emojipicker-wrapper">
                                    <EmojiPicker skinTonesDisabled={true} lazyLoadEmojis={false} onEmojiClick={selectEmoji} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-block">
                        <button className="btn btn-action-send" onClick={sendData}>
                            Send<span className="icon"><img src={require("../../../../assets/images/chat/paper-airplane.png")} alt="Send" /></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
