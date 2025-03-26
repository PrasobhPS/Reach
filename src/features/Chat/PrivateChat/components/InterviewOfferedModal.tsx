import React from "react";
import { Button } from "../../../../components/Button/Button";
import { InterviewInterface } from "../../../../types/PrivateChatInterfaces";
import "../../../../features/Cruz/components/Modal/ModalMatch.scss";
import { Modal, ModalBody } from "reactstrap";
import { getUserData } from "../../../../utils/Utils";
import { useAcceptInterviewMutation } from "../../../Cruz/Api/InterviewApiSlice";
import { format } from 'date-fns';

interface Props {
    interviewDetails: InterviewInterface;
    setInterviewDetails: React.Dispatch<React.SetStateAction<InterviewInterface | undefined>>
};

const baseUrl = process.env.REACT_APP_STORAGE_URL;

export const InterviewOfferedModal = ({ interviewDetails, setInterviewDetails }: Props) => {
    const userData = getUserData('userData');
    const [acceptInterviewCall] = useAcceptInterviewMutation();

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return format(date, 'dd MMMM yyyy');
    };

    const acceptInterview = async () => {
        if (interviewDetails.interview_id) {
            const params = {
                interview_id: interviewDetails.interview_id,
                status: 'A',
                is_cancel: 'employee',
            };
            const response = await acceptInterviewCall(params);

            if ("error" in response) {
                console.error(JSON.stringify(response.error));
            } else {
                setInterviewDetails(undefined);
            }
        }
    };

    return (
        <div>
            <Modal isOpen={interviewDetails != undefined} className="sidebar-modal" fade={false}>
                <ModalBody>
                    <div className="Employee-ProfilematchModal specialist-videomodal">
                        <div className="row">
                            <h2 className="customHeading">INTERVIEW OFFERED</h2>
                            <div className="text-para">
                                <p>You’ve been invited to an interview</p>
                            </div>
                            <div className="time-area">
                                <span>{formatDate(interviewDetails.date)}</span>
                                <span>{interviewDetails.time}</span>
                            </div>
                            <div className="image-wrapper">
                                <div className="imgbox">
                                    <img
                                        src={userData?.members_profile_picture ? userData.members_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                        alt="image"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="imgbox">
                                    <img
                                        src={interviewDetails.scheduler.member_profile_picture ? baseUrl + interviewDetails.scheduler.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                        alt="image"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                            <div className="chatOption-btn">
                                <Button
                                    onClick={acceptInterview}
                                    text="Accept Interview"
                                    icon={true}
                                    className="chat-optionbtn"
                                />
                                <a className="chatlater cursor-pointer" onClick={() => setInterviewDetails(undefined)}>
                                    Continue & chat later
                                </a>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default InterviewOfferedModal;