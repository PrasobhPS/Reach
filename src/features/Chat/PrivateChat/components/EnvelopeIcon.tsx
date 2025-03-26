import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useSocket } from "../../../../contexts/SocketContext";
import { getUserData } from "../../../../utils/Utils";

export default () => {
    const { isConnected, privateChatMember, isChatVisible, isShowEnvelopeIcon, setIsChatVisible, setShowChatList } = useSocket();
    const userData = getUserData("userData");

    const handleEnvelopeButtonClick = () => {
        if (privateChatMember) {
            setIsChatVisible(true);
        } else {
            setShowChatList(true);
        }
    };

    return (
        <div className={!isShowEnvelopeIcon || isChatVisible || !isConnected || !userData?.Token ? 'd-none' : 'envolope-wrapper d-none'} onClick={handleEnvelopeButtonClick}>
            <span className="icon"><FontAwesomeIcon icon={faEnvelope} /></span>
        </div>
    );
}