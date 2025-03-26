import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "../../../../components/Button/Button";
import { useAcceptStatusMutation, useCancelStatusMutation } from "../../MyBookingApiSlice";

interface AcceptBookingProps {
    isOpen: boolean;
    toggle: () => void;
    singlecard: any;
    userImage: string;
    afterAccept: () => void;
}

const AcceptBooking: React.FC<AcceptBookingProps> = ({
    isOpen,
    toggle,
    singlecard,
    userImage,
    afterAccept,
}) => {
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const [AcceptStatusupdation] = useAcceptStatusMutation();
    useEffect(() => {

    }, [singlecard.hourDifference])
    const accpetBooking = async (stepIndex: number) => {
        const response = await AcceptStatusupdation({ booking_id: stepIndex });
        if ("error" in response) {
            throw new Error("Failed to update");
        }
        toggle();

        // Call the parent function to apply effect
        afterAccept();
    };
    return (
        <Modal isOpen={isOpen} toggle={toggle} className="sidebar-modal">
            <ModalBody>
                <div className="specialist-videomodal mybooking-videocancel">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="image-wrapper">
                                <div className="imgbox">
                                    {singlecard.member_image ? (
                                        <img
                                            style={{ borderRadius: "50%" }}
                                            src={baseUrl + singlecard.member_image}
                                            className="img-fluid applicant-one"
                                            alt=""
                                        />
                                    ) : (
                                        <img
                                            src={require("../../../../assets/images/profile/Default.jpg")}
                                            alt="Profile"
                                            className="img-fluid"
                                        />
                                    )}
                                </div>
                                <div className="imgbox">
                                    {userImage ? (
                                        <img
                                            style={{ borderRadius: "50%" }}
                                            src={userImage}
                                            className="img-fluid applicant-one"
                                            alt=""
                                        />
                                    ) : (
                                        <img
                                            src={require("../../../../assets/images/profile/Default.jpg")}
                                            alt="Profile"
                                            className="img-fluid"
                                        />
                                    )}
                                </div>
                            </div>
                            <h3 className="customHeading">Accept this booking?</h3>
                            <p>
                                {singlecard.scheduleDate} at {singlecard.scheduledTime} with{" "}
                                {singlecard.firstName} {singlecard.lastName}
                            </p>
                            <div className="time-picker-box">
                                Are you sure you wish to accept this booking? .
                            </div>

                            <Button
                                theme="dark"
                                onClick={() => accpetBooking(singlecard.id)}
                                text="Accept Booking"
                                className="ConfirmCall w-100"
                                icon={true}
                            />
                            <div className="cancel">
                                <a className="button-link" onClick={toggle}>
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default AcceptBooking;
