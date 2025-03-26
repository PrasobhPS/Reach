import { useState, useEffect } from "react";
import { Button } from "../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "../assets/scss/PaymentStatus.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetPaymentInfoQuery } from "../features/Specialist/SpecialistApiSlice";
export const PaymentStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { transactionId, expertFName, expertLName, specialistfee, message } = location.state || {};
    const currentDate = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const [paymentInfo, setPaymentInfo] = useState<string>('');
    const { data, isLoading, isSuccess } = useGetPaymentInfoQuery({});
    useEffect(() => {
        if (data && isSuccess) {
            setPaymentInfo(data.data.payment_info);
        }
    }, [data, isSuccess])
    return (
        <div className="PaymentStatus-section">
            <div className="container">
                <div className="row">
                    <div className="page-path">
                        <div className="parent-direction">
                            <label><a style={{ cursor: "pointer" }}>Payment</a></label>
                        </div>
                        <span className="direction-arrow">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </span>
                    </div>
                </div>
                <div className="inner-section">
                    <div className="container-fluid px-0">
                        <div className="row">
                            <div className="col-md-6 col-12 order-ms-1">
                                <div className="first-cardsection">
                                    <div className="info card-custom">
                                        <div className="d-flex items-center">
                                            <span className="text-white"><FontAwesomeIcon icon={faInfoCircle} /></span>
                                            <h5 className="customHeading text-white mx-2 fw-bold">info</h5>
                                        </div>
                                        <div className="info-text">
                                            <p>{paymentInfo}</p>
                                        </div>
                                    </div>
                                    <div className="payment-method card-custom">
                                        <div className="payment-details">
                                            <h2 className="customHeading ">Payment Methods</h2>
                                            <div className="details-container">
                                                <ul>
                                                    <div className="d-flex align-items-center justify-content-start list">
                                                        <li>Name</li>
                                                        <li>{expertFName} {expertLName}</li>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-start list">
                                                        <li>Transaction ID</li>
                                                        <li>{transactionId}</li>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-start list">
                                                        <li>Date</li>
                                                        <li>{currentDate}</li>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-start list">
                                                        <li>Type of Transaction</li>
                                                        <li>Credit Card</li>
                                                    </div>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-12">
                                <div className="second-cardsection h-100">
                                    <div className="card-custom h-100">
                                        <div className="payment">
                                            {transactionId ? (
                                                <div className="success d-block">
                                                    <img src={require("../assets/images/payment/Success.png")} alt="" className="img-fluid" />
                                                    <h2 className="customHeading">Payment Successfull</h2>
                                                    <div className="payment-amount mx-auto">
                                                        <h2 className="text-center">Successfully Paid {specialistfee}</h2>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="fail d-block">
                                                    <img src={require("../assets/images/payment/failed.png")} alt="" className="img-fluid" />
                                                    <h2 className="customHeading">Payment Failed</h2>
                                                    <div className="payment-amount mx-auto">
                                                        <h2 className="text-center">{message}</h2>
                                                    </div>

                                                </div>
                                            )}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PaymentStatus;