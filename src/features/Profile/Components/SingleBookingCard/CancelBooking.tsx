import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "../../../../components/Button/Button";
import { useCancelStatusMutation } from "../../MyBookingApiSlice";

interface CancelBookingProps {
  isOpen: boolean;
  toggle: () => void;
  singlecard: any;
  userImage: string;
  afterCancel: () => void;
}

const CancelBooking: React.FC<CancelBookingProps> = ({
  isOpen,
  toggle,
  singlecard,
  userImage,
  afterCancel,
}) => {
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const [CancelStatusupdation] = useCancelStatusMutation();
  const percentage = (singlecard.hourDifference > 48) ? 'You will be refunded 75% of your original fee' : 'No refund will be there';
  useEffect(() => {

  }, [singlecard.hourDifference])
  const cancelBooking = async (stepIndex: number) => {
    const response = await CancelStatusupdation({ booking_id: stepIndex });
    if ("error" in response) {
      throw new Error("Failed to update");
    }
    toggle();

    // Call the parent function to apply effect
    afterCancel();
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
              <h3 className="customHeading">Cancel this booking?</h3>
              <p>
                {singlecard.scheduleDate} at {singlecard.scheduledTime} with{" "}
                {singlecard.firstName} {singlecard.lastName}
              </p>
              <div className="time-picker-box">
                Are you sure you wish to cancel your booking? {percentage}.
              </div>

              <Button
                theme="dark"
                onClick={() => cancelBooking(singlecard.id)}
                text="Cancel Booking"
                className="ConfirmCall w-100"
                icon={true}
              />
              <div className="cancel">
                <a className="button-link" onClick={toggle}>
                  Keep the Booking
                </a>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CancelBooking;
