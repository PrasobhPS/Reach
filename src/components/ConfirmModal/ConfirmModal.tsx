import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import "../../assets/scss/membership.scss";
import "./ConfirmModal.scss";
import { useGlobalModalContext } from "../../utils/GlobalModal";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Heading } from "../Heading/Heading";
import {
  useDeactivateProfileMutation,
  useDeleteProfileMutation,
  useRemovePictureMutation,
} from "../../features/Profile/profileApiSlice";
import { getUserData, clearUserData } from "../../utils/Utils";

function ConfirmModal() {
  const { hideModal, store } = useGlobalModalContext();
  const { modalProps } = store || {};
  const { title, details, cards, confirmBtn } = modalProps || {};
  const [buttonName, setButtonName] = useState<string>('Confirm');
  const handleModalToggle = () => {
    hideModal();
    if (modalProps.onCloseCallback) {
      modalProps.onCloseCallback(); // Invoke the onCloseCallback if provided
    }
  };
  useEffect(() => {
    if (confirmBtn) {
      setButtonName(confirmBtn);
    }
  }, [confirmBtn])


  const handleSubmit = () => {
    if (confirmBtn === "Deactivate") {
      deactivateProfile();
    } else if (confirmBtn === "Delete") {
      deleteProfile();
    } else if (confirmBtn === "Remove") {
      removePic();
    } else if (confirmBtn === "DeleteMessage") {
      if (modalProps.deleteMessage && modalProps.messageId) {
        modalProps.deleteMessage(modalProps.messageId);
      }
      hideModal();
    } else if (confirmBtn === "Delete Image") {
      if (modalProps.handleRemoveImages && modalProps.removeImage) {
        modalProps.handleRemoveImages(modalProps.removeImage);
      }
      hideModal();
    } else if (confirmBtn == 'Confirm') {
      if (modalProps.handleConfirm) {
        modalProps.handleConfirm(modalProps.callback);
      }
      if (modalProps.handleSubmit()) {
        modalProps.handleSubmit('');
      }
    } else if (confirmBtn == 'OK') {
      if (modalProps.handleSubmit()) {
        modalProps.handleSubmit('');
        handleModalToggle();
      }
    }

  };

  const handleChangeCard = () => {
    modalProps.handleChangeCard();
  }
  const userData = getUserData("userData");
  let token = "";
  try {
    if (userData !== null) {
      token = userData.Token;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const [deactivateProfileMutation] = useDeactivateProfileMutation();

  const deactivateProfile = async () => {
    const remove = await deactivateProfileMutation(token);
    if ("error" in remove) {
      console.error("Error logging in:", remove.error);
    } else {
      clearUserData();
    }
  };

  const [deleteProfileMutation] = useDeleteProfileMutation();

  const deleteProfile = async () => {
    const remove = await deleteProfileMutation(token);
    if ("error" in remove) {
      console.error("Error logging in:", remove.error);
    } else {
      clearUserData();
    }
  };

  const [removePicture] = useRemovePictureMutation();
  const removePic = async () => {
    const remove = await removePicture(token);
    if ("error" in remove) {
      console.error("Error logging in:", remove.error);
    } else {
      handleModalToggle();
      // localStorage.setItem("userData", JSON.stringify(userData.data.data));
    }
  };

  return (
    <div>
      <Modal
        title={title || "Confirm"}
        isOpen={true}
        onClose={handleModalToggle}
        centered
        className="Remove-alert confirm-modal"
      >
        <ModalBody>
          <ModalHeader></ModalHeader>
          <div className="confirm-box">
            <div className="confirm-box-inner">
              <div className="row  mx-0">
                <div className="row content-box-new  justify-content-center">

                  {!modalProps.handleChangeCard && (
                    <span className="icon-info">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                    </span>
                  )}
                  <h2 className="row justify-content-center">{title}</h2>
                  <p className="row justify-content-center">{details}</p>
                  {cards && cards !== '0' && (
                    <p className="row justify-content-center">**** **** **** {cards}</p>
                  )}
                  {modalProps.handleChangeCard && (
                    <>
                      <p className="row justify-content-center" style={{ cursor: "pointer", color: "#ff0075", marginBottom: "0px", textDecorationLine: "underline" }} onClick={handleChangeCard}>
                        Change Card
                      </p>

                      <div className="payment-tabinfo">
                        <ul>
                          <li>
                            The expert needs to confirm the booking and may request a different time
                          </li>
                          <li>
                            If you cancel the booking up to 48hrs before you receive 75%. If you cancel the booking within 48hrs you do not get a refund
                          </li>
                          <li>
                            You can rearrange booking up to 48hrs before the consultation maximum once. Within 48hrs you cannot rearrange.
                          </li>
                        </ul>
                        <div className="info-icon">
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {cards !== '0' && (
                  <div className="row content-box-new justify-content-center">
                    {confirmBtn ? (
                      <div className="col-md-4">
                        <Button
                          onClick={() => handleSubmit()}
                          text={buttonName}
                          icon={false}
                          theme="light"
                          className="w-100"
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="col-md-4">
                      <Button
                        onClick={handleModalToggle}
                        text="Cancel"
                        icon={false}
                        theme="dark"
                        className="w-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ConfirmModal;
