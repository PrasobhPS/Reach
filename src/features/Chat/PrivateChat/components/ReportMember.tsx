import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Button } from "../../../../components/Button/Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { MemberInterface } from "../../../../types/PrivateChatInterfaces";
import { useSocket } from "../../../../contexts/SocketContext";
import { useReportMemberMutation } from "../../Api/ReportMemberApiSlice";
import { getUserData } from "../../../../utils/Utils";
import { useState } from "react";
import { MODAL_TYPES, useGlobalModalContext } from "../../../../utils/GlobalModal";

interface Props {
    reportMember?: MemberInterface | undefined;
    setReportMember: React.Dispatch<React.SetStateAction<MemberInterface | undefined>>;
}

export const ReportMember = ({ reportMember, setReportMember }: Props) => {
    const { setIsChatVisible } = useSocket();
    const userData = getUserData('userData');
    const [reason, setReason] = useState<string | null>(null);
    const [reportMemberCall] = useReportMemberMutation();
    const { showModal, hideModal } = useGlobalModalContext();

    const handleReportMember = async () => {
        showModal(MODAL_TYPES.CONFIRM_MODAL, {
            title: "Report Member",
            details: "Are you sure you want to continue?",
            confirmBtn: "Confirm",
            handleConfirm: async () => {
                const params = {
                    reported_member_id: reportMember?.member_id,
                    reported_by_member_id: userData?.Member_id,
                    report_reason: reason
                };

                const response = await reportMemberCall(params);

                if ("error" in response) {
                    console.error(JSON.stringify(response.error));
                } else {
                    setIsChatVisible(false);
                    setReportMember(undefined);
                    setReason('');
                    hideModal();
                }
            }
        });
    };

    return (
        <div className="report-modal">
            <Modal
                isOpen={reportMember !== undefined}
                centered
                className="login-modal modal-reprt"
            >
                <ModalBody>
                    <ModalHeader>
                        <h1>Report Member</h1>
                        <span className="icon-close"><FontAwesomeIcon icon={faClose} onClick={() => setReportMember(undefined)} /></span>
                    </ModalHeader>
                    <div className="form-group">
                        <span>
                            You are reporting {reportMember?.member_fname} {reportMember?.member_lname}
                        </span>
                        <textarea value={reason ?? ''} placeholder="Reason" onChange={(e) => setReason(e.target.value)} />
                        <div className="button-area">
                            <Button text="Report" className="btn btn-report" onClick={handleReportMember} />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default ReportMember;