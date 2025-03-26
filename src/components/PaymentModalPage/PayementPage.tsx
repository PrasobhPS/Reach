import React, { useState, useEffect } from "react";
import "./payementpage.scss";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { CheckoutForm } from "../PaymentModal/CheckoutForm";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData, setUserData } from "../../utils/Utils";
import { useIosloginMutation } from "../../features/Login/authApiSlice";
import {
  useBookSpecialistMutation,
  useUpdateBookingStatusMutation,
} from "../../features/Specialist/SpecialistApiSlice";
import { setCredentials } from "../../app/authSlice";
import { useAppDispatch } from "../../Hooks/hooks";
import Swal from "sweetalert2";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { usePaymentCardChangeMutation } from "../../features/Profile/profileApiSlice";
import { useRegistrationUpdateMutation } from "../../features/Login/authApiSlice";

const stripe_key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(`${stripe_key}`);

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export const PayementPage = () => {
  const appLink = process.env.REACT_APP_LINK_URL;
  const fallbackUrl = process.env.REACT_APP_FALLBACK_URL;
  const userData = getUserData("userData");
  const navigate = useNavigate();
  const location = useLocation();
  const [iosLoginCalled, setIosLoginCalled] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<any>({});
  let ios_token = "";
  let member_id = "";
  function sendToApp(data: any) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  }
  useEffect(() => {
    // Get the URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const encodedData = queryParams.get("q");
    ios_token = queryParams.get("t") || "";
    member_id = queryParams.get("member_id") || "";

    if (encodedData) {
      // Decode the Base64 data
      const decodedData = atob(encodedData);

      // Parse the JSON string into an object
      const bookingDetails = JSON.parse(decodedData);
      setBookingData(bookingDetails);

      // Now you can use the bookingDetails object
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [ios_login] = useIosloginMutation();
  const [BookSpecialist] = useBookSpecialistMutation();
  const [cardChange] = usePaymentCardChangeMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [registrationUpdate] = useRegistrationUpdateMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const updateData = async () => {
      if (ios_token === "" || iosLoginCalled) return; // Skip if token is missing or already called

      try {
        setIosLoginCalled(true); // Set the flag before calling to prevent duplicate calls
        const formData = { ios_token };
        const response = await ios_login(formData).unwrap();

        if ("error" in response) {
          console.error("Error logging in:", response.error);
        } else {
          setUserData(response.userData);
          const users = response.userData;

          const { Member_type, Token } = users;
          dispatch(setCredentials({ users, Token }));
        }
      } catch (error) {
        console.error("An error occurred during iOS login:", error);
      }
    };

    updateData();
  }, []);


  const stripeTokenHandler = async (stripeToken: string) => {
    if (stripeToken === "Error") {
      return;
    }
    if (bookingData && bookingData.booking_id) {
      setLoading(true);

      const dataSave = {
        booking_id: bookingData.booking_id,
        type: bookingData.type,
        stripeToken: stripeToken,
      };
      const response = await updateBookingStatus(dataSave);

      if ("error" in response) {
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
        setLoading(false);

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
            // const appLink = `reach://192.168.1.129:3000/?status=failed&message=${text}`;
            // const fallbackLink = "http://192.168.1.129:3000";
            const randomToken = Math.random().toString(36).substring(2, 8);
            window.location.href = `${appLink}${randomToken}?status=failed&message=${text}`;

            setTimeout(() => {
              navigate("/");
              //window.location.href = fallbackUrl || '';
            }, 2000); // Adjust timeout for user experience
          }
        });
      } else {
        setLoading(false);
        let transactionId = response.data.data.transactionId;
        let specialist_name = response.data.data.specialist_name;
        let title = "Payment Done!";
        let text = `Awaiting confirmation from ${specialist_name}`;

        Swal.fire({
          title: "Payment Done!",
          text: `Awaiting confirmation from ${specialist_name}`,
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
            // const appLink = `reach://192.168.1.129:3000/?status=success&message=Awaiting confirmation from ${specialist_name}`;
            // const fallbackLink = "http://192.168.1.129:3000";

            const randomToken = Math.random().toString(36).substring(2, 8);
            window.location.href = `${appLink}${randomToken}?status=success&message=Awaiting confirmation from ${specialist_name}`;

            setTimeout(() => {
              navigate("/");
              //window.location.href = fallbackUrl || '';
            }, 2000); // Adjust timeout for user experience
          }
        });
      }
    } else if (member_id === "") {
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
            // const appLink = `reach://192.168.1.129:3000/?status=success&message=Awaiting confirmation from ${specialist_name}`;
            // const fallbackLink = "http://192.168.1.129:3000";

            const randomToken = Math.random().toString(36).substring(2, 8);
            window.location.href = `${appLink}${randomToken}?status=success&message=${response.data.message}`;

            setTimeout(() => {
              navigate("/");
              //window.location.href = fallbackUrl || '';
            }, 2000); // Adjust timeout for user experience
          }
        });
      } else if ("error" in response) {
        setLoading(false);
        console.error("Error logging in:", response.error);
        let text = "Please try again";
        if (typeof response.error === "string") {
          //console.log("firstError", response.error); // Assign the error message if it's already a string
          text = response.error;
        } else {
          const fetchError = response.error as FetchBaseQueryError; // Type assertion
          if (
            fetchError.data &&
            typeof fetchError.data === "object" &&
            "error" in fetchError.data &&
            typeof fetchError.data.error === "string"
          ) {
            //console.log("fetcherror---", fetchError.data.error);
            text = fetchError.data.error;
          } else {
            //console.log("An error occurred"); // Handle cases where error property doesn't exist
          }
        }
        setLoading(false);

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
            // const appLink = `reach://192.168.1.129:3000/?status=failed&message=${text}`;
            // const fallbackLink = "http://192.168.1.129:3000";
            const randomToken = Math.random().toString(36).substring(2, 8);
            window.location.href = `${appLink}${randomToken}?status=failed&message=${text}`;

            setTimeout(() => {
              navigate("/");
              //window.location.href = fallbackUrl || '';
            }, 2000); // Adjust timeout for user experience
          }
        });
      }
    } else {
      const passData = {
        member_id: member_id,
        stripeToken: stripeToken,
      };
      const response = await registrationUpdate(passData);
      if ("data" in response) {
        setLoading(false);
        const data = {
          type: "membership",
          data: "M",
        };
        sendToApp(data);
      } else if ("error" in response) {
        const data = {
          type: "membership",
          data: "F",
        };
        sendToApp(data);
      }
    }
  };

  const [isTokenGenerated, setIsTokenGenerated] = useState(false);

  const handleTokenGenerated = () => {
    setIsTokenGenerated(true);
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="container">
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
        <div className="col-md-12 col-12">
          <div className="payement-page">
            <h2 className="customHeading">
              {bookingData && bookingData.booking_id
                ? "Expert Booking Payment"
                : "Payment Card Change"}
            </h2>
            <div className="payment-tabinfo">
              {bookingData && bookingData.booking_id ? (
                <ul>
                  <li>
                    The expert needs to confirm the booking and may request a
                    different time.
                  </li>
                  <li>
                    If you cancel the booking up to 48hrs before, you receive
                    75%. If you cancel the booking within 48hrs, you do not get
                    a refund.
                  </li>
                  <li>
                    You can rearrange the booking up to 48hrs before the
                    consultation a maximum of once. Within 48hrs, you cannot
                    rearrange.
                  </li>
                </ul>
              ) : member_id === "" ? (
                <ul>
                  <li>
                    We will charge $1 to your card for validation, and this
                    amount will be refunded immediately.
                  </li>
                </ul>
              ) : (
                ""
              )}
              <div className="info-icon">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
            </div>
            <div className="login-box p-0">
              <div className="login-box-inner mt-3">
                <div className="row mx-0">
                  <Elements stripe={stripePromise}>
                    {/* <CheckoutForm
                      stripeTokenHandler={stripeTokenHandler}
                      onTokenGenerated={handleTokenGenerated}
                      from={"modal"}

                    /> */}
                  </Elements>
                  <div className="card-img">
                    <img
                      src={require("../../assets/images/payment/cards/payment12.png")}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-end px-0">
                    <button
                      type="submit"
                      form="checkout-form"
                      id="submit-button"
                      className="w-100 btn btn-pay"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PayementPage;
