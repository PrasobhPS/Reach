import "./SingleChatInput.scss";
import { faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSocket } from '../../../../contexts/SocketContext';
import { MemberInterface, MessageInterface } from "../../../../types/PrivateChatInterfaces";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { getUserData } from "../../../../utils/Utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const socketUrl: string = process.env.REACT_APP_SOCKET_URL as string;

interface SingleChatInputProps {
   replyMessage: MessageInterface | undefined;
   editMessage: MessageInterface | undefined;
   setEditMessage: React.Dispatch<SetStateAction<MessageInterface | undefined>>;
   setReplyMessage: React.Dispatch<SetStateAction<MessageInterface | undefined>>;
   setShowLoader: React.Dispatch<SetStateAction<boolean>>;
}

export const SingleChatInput = ({ replyMessage, editMessage, setReplyMessage, setEditMessage, setShowLoader }: SingleChatInputProps) => {
   const { socket, isConnected, isChatVisible, privateChatMember, chatType } = useSocket();
   const userData = getUserData('userData');
   const inputFileRef = useRef<HTMLInputElement>(null);
   const textInputRef = useRef<HTMLDivElement>(null);
   const [text, setText] = useState<string>(""); 
   const [typingUser, setTypingUser] = useState<MemberInterface | undefined>(undefined);

   const sendMessage = () => {
      if (!socket?.connected) return;

      if (textInputRef.current && textInputRef.current.innerText.trim() != '' && userData?.Member_id && privateChatMember?.member_id) {
         if (editMessage) {
            socket.emit('editPrivateMessage', {
               receiver_id: privateChatMember.member_id,
               edited_text: textInputRef.current.innerText,
               message_id: editMessage.message_id
            });

            setEditMessage(undefined);
         } else {
            socket.emit('privateMessage', {
               sender_id: userData.Member_id,
               receiver_id: privateChatMember.member_id,
               message: textInputRef.current.innerText,
               chat_type: chatType,
               reply_of: replyMessage?.message_id
            });

            socket.emit('privateMembers');
            socket.emit('cruzChatList');
            setReplyMessage(undefined);
         }

         setShowEmoji(false);

         if (textInputRef.current) {
            textInputRef.current.innerHTML = '';
            setText('');
         }
      }
   };

   useEffect(()=>{
      if(text.trim() !== ""){
         socket?.emit('privateTyping', { receiver_id: privateChatMember?.member_id });
      }else{
         socket?.emit('stopPrivateTyping', { receiver_id: privateChatMember?.member_id });
      }
   },[text]);

   useEffect(()=>{
      socket?.emit('stopPrivateTyping', { receiver_id: privateChatMember?.member_id });
   },[isChatVisible, chatType]);

   useEffect(() => {
      if (!socket?.connected || !privateChatMember) return;

      socket.on('privateTyping', (memberId: string) => {
         if (privateChatMember?.member_id == memberId) {
            setTypingUser(privateChatMember);
         }
      });

      socket.on('stopPrivateTyping', (memberId: string) => {
         if (privateChatMember?.member_id == memberId) {
            setTypingUser(undefined);
         }
      });

      return () => {
         socket.off('privateTyping');
         socket.off('stopPrivateTyping');
      };
   }, [socket,isConnected, privateChatMember]);

   let typingTimeout: any;

   const handleTextInputKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
         if (!event.shiftKey) {
            event.preventDefault();
            sendMessage();
         }
      }

      clearTimeout(typingTimeout);
   };

   const handleTextInputKeyUp = () => {
      // clearTimeout(typingTimeout);

      // typingTimeout = setTimeout(() => {
      //    if (socket?.connected) {
      //       socket.emit('stopPrivateTyping', { receiver_id: privateChatMember?.member_id });
      //    }
      // }, 500);
   };

   useEffect(() => {
      if (textInputRef.current) {
         textInputRef.current.innerHTML = '';
         setText('');
      }
   }, [privateChatMember]);

   useEffect(() => {
      if (textInputRef.current) {
         textInputRef.current.focus();
      }
   }, [isChatVisible]);

   
   const typingMessageRef = useRef<HTMLDivElement>(null);

   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

      if (socket?.connected) {
         if (typingMessageRef.current)
            typingMessageRef.current.textContent = `Files are uploading`;

         const files = event.target.files;

         if (files && files.length > 0) {
            const filesData: any[] = [];

            Array.from(files).forEach((file) => {
               const reader = new FileReader();

               reader.onload = () => {
                  filesData.push({ file_data: reader.result, original_name: file.name });

                  if (filesData.length === files.length) {
                     socket.emit('privateFiles', {
                        filesData: filesData,
                        receiver_id: privateChatMember?.member_id,
                        chat_type: chatType,
                        reply_of: replyMessage?.message_id
                     });

                     setReplyMessage(undefined);
                     if (typingMessageRef.current)
                        typingMessageRef.current.textContent = '';
                  }
               };

               reader.onerror = (error) => {
                  console.error('Error reading file:', error);
                  if (typingMessageRef.current)
                     typingMessageRef.current.textContent = '';
               };

               reader.onloadstart = () => {
                  setShowLoader(true);
               };

               reader.readAsArrayBuffer(file);
            });
         }
      }
   };

   useEffect(() => {
      if (typingMessageRef.current) {
         if (typingUser) {
            typingMessageRef.current.textContent = `${typingUser?.member_fname} ${typingUser?.member_lname} is typing...`;
         } else {
            typingMessageRef.current.textContent = '';
         }
      }
   }, [typingUser]);

   const [showEmoji, setShowEmoji] = useState<boolean>(false);

   const emojiPickerRef = useRef<HTMLDivElement | null>(null);

   document.addEventListener('mousedown', (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
         setShowEmoji(false);
      }
   });

   const handleSelectEmoji = (emojiData: EmojiClickData) => {
      // const data = `<img alt="${emojiData.emoji}" draggable="false" src="${socketUrl}/emoji/${emojiData.unified}"></img>`;
      const data = emojiData.emoji;

      if (textInputRef.current) {
         textInputRef.current.innerHTML = textInputRef.current.innerHTML + data;
         appendCursor();
      }
   };

   const appendCursor = () => {
      if (textInputRef.current) {
         textInputRef.current.focus();
         const range = document.createRange();
         const selection = window.getSelection();
         if (range && selection) {
            range.selectNodeContents(textInputRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
         }
      }
   };

   useEffect(() => {
      if (textInputRef.current) {
         textInputRef.current.textContent = editMessage ? editMessage.message : '';
         appendCursor();
      }
   }, [editMessage]);

   useEffect(() => {
      if (textInputRef.current) {
         textInputRef.current.focus();
      }
   }, [replyMessage]);

   const handleInput = () => {
      if (textInputRef.current) {
         const newText = textInputRef.current.innerText.trim(); // Trim to check emptiness
         setText(newText);
      }
    };

   return (
      <>
         {privateChatMember && privateChatMember?.member_id >= '0' &&
            <>
               <div className="typping-msg" ref={typingMessageRef}></div>
               <div className="input-area">
                  <div className="d-flex align-items-center justify-content-between">
                     <div className={privateChatMember?.member_id == '0' ? "d-none" : "add-file cursor-pointer"}>
                        <input
                           ref={inputFileRef}
                           id="private_file_input"
                           type="file"
                           accept="image/*,video/*,.pdf,.doc,.docx,.txt,.ppt,.xls,.csv"
                           multiple
                           onChange={handleFileUpload}
                           onClick={() => { if (inputFileRef.current) inputFileRef.current.value = '' }}
                        />
                        <label htmlFor="private_file_input" className="icon"><FontAwesomeIcon icon={faPlus} /></label>
                     </div>
                     <div className={privateChatMember?.member_id == '0' ? "d-none" : "smile-area"}>
                        <div className="smile-block" onClick={() => setShowEmoji(true)}>
                           <img src={require("../../../../assets/images/chat/smile.png")} alt="" />
                        </div>
                        <div className={showEmoji ? "smile-wrapper" : "d-none"} ref={emojiPickerRef}>
                           <EmojiPicker height={300} width={'100%'} skinTonesDisabled={true} lazyLoadEmojis={false} onEmojiClick={handleSelectEmoji} />
                        </div>
                     </div>
                     <div className="message">
                        <div
                           ref={textInputRef}
                           className="message-area"
                           contentEditable
                           onKeyDown={handleTextInputKeyDown}
                           onKeyUp={handleTextInputKeyUp}
                           onInput={handleInput}
                        />
                     </div>
                     <div className="action-button" onClick={sendMessage}>
                        <span className="icon"><FontAwesomeIcon icon={faPaperPlane} /></span>
                     </div>
                  </div>
                  <div className="chat-footer">
                     <div className="divider"></div>
                  </div>
               </div></>
         }
      </>
   )
}

export default SingleChatInput;