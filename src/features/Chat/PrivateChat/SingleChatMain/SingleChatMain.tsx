import "./SingleChatMain.scss";
import { SingleChatInput } from "../SingleChatInput/SingleChatInput";
import SingleChatHeader from "../SingleChatHeader/SingleChatHeader";
import SingleChatMessage from "../SingleMessage/SingleMessage";
import { useSocket } from "../../../../contexts/SocketContext";
import { useState } from "react";
import { MessageInterface } from "../../../../types/PrivateChatInterfaces";

export const SingleChatMain = () => {
    const { isConnected, isChatVisible,privateChatMember } = useSocket();
    const [editMessage, setEditMessage] = useState<MessageInterface>();
    const [replyMessage, setReplyMessage] = useState<MessageInterface>();
    const [showLoader, setShowLoader] = useState<boolean>(false);

    return (
        <div className={isConnected ? '' : 'd-none'}>
            <div className={isChatVisible ? 'single-chat-container' : 'd-none'}>
                <SingleChatHeader />
                <SingleChatMessage setShowLoader={setShowLoader} replyMessage={replyMessage} editMessage={editMessage} setReplyMessage={setReplyMessage} setEditMessage={setEditMessage} />
                {!privateChatMember?.is_blocked && (
                    <SingleChatInput setShowLoader={setShowLoader} replyMessage={replyMessage} editMessage={editMessage} setReplyMessage={setReplyMessage} setEditMessage={setEditMessage} />
                )}
                <div className={showLoader ? "chatpage-loader" : "d-none"}>
                    <div className="page-innerLoader">
                        <div className="spinner-border" role="status">
                            <img src={require("../../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleChatMain;
