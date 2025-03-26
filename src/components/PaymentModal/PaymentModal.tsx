import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useGlobalModalContext } from "../../utils/GlobalModal";
import "./PaymentModal.scss";
import { loadStripe, Token } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserData } from "../../utils/Utils";
import { faAngleRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { usePaymentCardChangeMutation } from "../../features/Profile/profileApiSlice";
import { useGetCountryIsoQuery } from "../../features/Profile/profileApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
const stripe_key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(`${stripe_key}`);
const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function PaymentModal() {
  const { hideModal, store } = useGlobalModalContext();
  const [modal1Open, setModal1Open] = useState(false);
  const { modalProps } = store || {};
  const userData = getUserData("userData");
  const [cardChange] = usePaymentCardChangeMutation();
  const [countryIso, setCountryIso] = useState<string>('GB');
  const { data: countryData, isSuccess, isLoading } = useGetCountryIsoQuery({});

  const toggleModal1 = () => {
    setModal1Open(!modal1Open);
  };

  const handleModalToggle = () => {
    hideModal();
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (countryData && isSuccess) {
      setCountryIso(countryData.country_iso);
    }
  }, [countryData, isSuccess])
  const stripeTokenHandler = async (stripeToken: string) => {
    if (stripeToken === "Error") {
      return;
    }
    if (modalProps.handleSubmit) {
      modalProps.handleSubmit(stripeToken);
    } else {
      setLoading(true);
      const passData = {
        stripeToken: stripeToken,
      };

      const response = await cardChange(passData);
      if ("data" in response) {
        setLoading(false);
        Swal.fire({
          title: "Payment Done!",
          text: `${response.data.message}`,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          backdrop: `
                                      rgba(255, 255, 255, 0.5)
                                      left top
                                      no-repeat
                                      filter: blur(5px);
                                    `,
          background: "#fff",
        }).then(async (result) => {
          if (result.isConfirmed) {
            hideModal();
            modalProps.onClose();
          }
        });
      } else if ("error" in response) {
        setLoading(false);
        console.error("Error logging in:", response.error);
        let text = "Please try again";
        if (typeof response.error === "string") {
          text = response.error;
        } else {
          const fetchError = response.error as FetchBaseQueryError; // Type assertion
          if (
            fetchError.data &&
            typeof fetchError.data === "object" &&
            "error" in fetchError.data &&
            typeof fetchError.data.error === "string"
          ) {
            text = fetchError.data.error;
          } else {
            //console.log("An error occurred"); // Handle cases where error property doesn't exist
          }
        }

        Swal.fire({
          title: "Payment Failed!",
          text: `${text}`,
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          backdrop: `
                                      rgba(255, 255, 255, 0.5)
                                      left top
                                      no-repeat
                                      filter: blur(5px);
                                    `,
          background: "#fff",
        }).then(async (result) => {
          if (result.isConfirmed) {
            hideModal();
            modalProps.onClose();
          }
        });
      }
    }
  };
  const [message, setMessage] = useState<string | null | undefined>(null);

  const [isTokenGenerated, setIsTokenGenerated] = useState(false);

  const handleTokenGenerated = () => {
    setIsTokenGenerated(true);
  };

  return (
    <Modal
      isOpen={true}
      centered
      toggle={toggleModal1}
      onClose={handleModalToggle}
      className="payementmodal"
    >
      {loading ? (
        <div className="page-loader">
          <div className="page-innerLoader">
            <div className="spinner-border" role="status">
              <img
                src={require("../../assets/images/cruz/Frame.png")}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      ) : (
        <ModalBody>
          <ModalHeader toggle={handleModalToggle}>PAYMENT</ModalHeader>

          <div
            className={
              modalProps.hideInstruction ? "d-none" : "payment-tabinfo"
            }
          >
            {modalProps.handleSubmit ? (
              <ul>
                <li>
                  The expert needs to confirm the booking and may request a
                  different time
                </li>
                <li>
                  If you cancel the booking up to 48hrs before you receive 75%.
                  If you cancel the booking within 48hrs you do not get a refund
                </li>
                <li>
                  You can rearrange booking up to 48hrs before the consultation
                  maximum once. Within 48hrs you cannot rearrange.
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  We will charge $1 to your card for validation, and this amount
                  will be refunded immediately.
                </li>
              </ul>
            )}
            <div className="info-icon">
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
          </div>
          <div className="login-box p-0">
            <div
              className={
                modalProps.amount && userData?.currency
                  ? "amount-box my-2"
                  : "d-none"
              }
            >
              <div className="p-2 d-none">
                <div>
                  <h2 className="customHeading">Payment Amount</h2>
                </div>
                <div className="amount">
                  <span>
                    {userData?.currency && currencySymbols[userData.currency]}{" "}
                    {modalProps.amount}
                  </span>
                </div>
              </div>
            </div>
            <div className="login-box-inner">
              <div className="row mx-0">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    stripeTokenHandler={stripeTokenHandler}
                    onTokenGenerated={handleTokenGenerated}
                    from={"modal"}
                    currency={modalProps.currencySymbol}
                    amount={modalProps.amount}
                    country={userData?.country || countryIso}
                  />
                </Elements>
                <div className="card-img">
                  <img
                    src={require("../../assets/images/membersignup/payment-new.png")}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="d-flex align-items-center justify-content-end px-0">
                  <button
                    type="submit"
                    form="checkout-form"
                    id="submit-button"
                    className="w-100 btn btn-pay mt-3"
                  >
                    Pay Securely Now
                    <span>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      )}
    </Modal>
  );
}

export default PaymentModal;
