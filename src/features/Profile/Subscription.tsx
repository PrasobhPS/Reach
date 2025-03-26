import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import '../../features/MemberSignup/MembershipSetup.scss';
import { useNavigate } from "react-router-dom";
import { MemebershipProps } from "../../types";
import { useGetUnsuscribePlanMutation } from "./profileApiSlice";
import { getUserData, setUserData } from "../../utils/Utils";
import Swal from "sweetalert2";
import moment from "moment";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import { useGetMemberCardDetailsQuery } from "../Specialist/SpecialistApiSlice";

interface SubscriptionProps {
    heading: string;
    membershipExpire?: string;
    keyFeatures: string[];
    membershipFee?: number;
    yearlyFee?: number;
    subscriptionPlan?: string;
    memberType: string;
    referral_code?: string;
    discountAmount?: string;
}

export const Subscription: React.FC<SubscriptionProps> = ({
    referral_code,
    heading,
    membershipExpire,
    keyFeatures,
    membershipFee,
    yearlyFee,
    subscriptionPlan,
    memberType,
    discountAmount,
}) => {
    const navigate = useNavigate();
    let Fee = 0;

    if (subscriptionPlan === 'Annual') {
        if (yearlyFee) Fee = yearlyFee;
    } else {
        if (membershipFee) Fee = membershipFee;
    }

    let showFee: string = String(Fee);
    if (discountAmount) {
        showFee = discountAmount;
    }
    const currencySymbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
    };
    const [unSubscribePlan] = useGetUnsuscribePlanMutation();
    const [showButton, setShowButton] = useState<boolean>(true);
    const userData = getUserData("userData");
    let currencySymbol = "GBP";
    let token = "";

    if (userData !== null) {
        token = userData.Token;
        currencySymbol = userData.currency ? userData.currency : "GBP";

    } else {
        console.error("User data not found in local storage");
    }

    useEffect(() => {
        if (userData?.subscription_status === 'I') {
            setShowButton(false);
        }
    }, [userData]);

    const handleClick = () => {
        if (memberType !== 'M') {
            navigate(`/member-signup`, {
                state: {
                    referral_code: referral_code,
                },
            });
        }
    };

    const handleCancelSubscription = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will cancel your subscription.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'Cancel',
            backdrop: `
                rgba(255, 255, 255, 0.5)
                left top
                no-repeat
                filter: blur(5px);
            `,
            background: '#fff',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await unSubscribePlan(token);
                if ("error" in response) {
                    console.error("Error logging in:", response.error);
                } else {
                    Swal.fire({
                        title: "Subscription Cancelled!",
                        text: `You can have the privileges till the subscription end date`,
                        icon: "success",
                        timer: 3000,
                        showConfirmButton: false,
                        backdrop: `
                            rgba(255, 255, 255, 0.5)
                            left top
                            no-repeat
                            filter: blur(5px);
                        `,
                        background: '#fff',
                    });
                    setShowButton(false);
                    if (userData != null) {
                        userData.subscription_status = 'I';
                        setUserData(userData);
                    }
                }
            }
        });
    };

    const { data: cardDetails, isSuccess, isLoading: cardLoading, refetch } = useGetMemberCardDetailsQuery({});
    useEffect(() => {
        refetch();
    }, [])
    const [cardLast, setCardLast] = useState<string>('0');
    useEffect(() => {
        if (isSuccess && cardDetails) {
            setCardLast(cardDetails.last_4);
        }
    }, [cardDetails, isSuccess])

    const { hideModal, store } = useGlobalModalContext();
    const { showModal } = useGlobalModalContext();
    const handleChangeCard = async () => {
        showModal(MODAL_TYPES.PAYMENT_MODAL, {
            currencySymbol: currencySymbols[currencySymbol],
            amount: 0,
            onClose: () => {
                refetch(); // Trigger refetch when the modal is closed
            }
        });
    }

    return (
        <div className="subsscription-tabcondition">
            <div className="tabcondition">
                <h2 className="customHeading">Your current Plan</h2>
            </div>
            {memberType !== "M" ? (
                <div className={`Membership-cardtheme full-membershipcard`}>
                    <div className="card-themeheader"></div>
                    <div className="card-content">
                        <div className="card-heading">
                            <h3 className="customHeading">{heading}</h3>
                        </div>
                        <div className="card-body">
                            <div className="btn-groups">
                                <Button
                                    onClick={handleClick}
                                    text="Upgrade Membership"
                                    icon={true}
                                    theme="light"
                                    className="w-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="full-membership">
                    <div className={`Membership-cardtheme free-membershipcard`}>
                        <div className="card-themeheader"></div>
                        <div className="card-content">
                            <div className="card-heading">
                                <h3 className="customHeading">full membership</h3>
                            </div>
                            <div className="card-body">
                                <div className="content">
                                    <div className="card-text">
                                        <span>Current Status</span>
                                    </div>
                                    <div className="card-text">
                                        <span className="active">Active</span>
                                    </div>
                                </div>
                                <div className="content">
                                    <div className="card-text">
                                        <span>Plan expires on</span>
                                    </div>
                                    <div className="card-text">
                                        <span>{membershipExpire ? moment(membershipExpire).format('DD MMM YYYY') : ''}</span>
                                    </div>
                                </div>
                                <div className="amount-details">
                                    <div className="fullmembership-content">
                                        {String(Fee) !== String(showFee) ? (
                                            <>
                                                <h4 className="customHeading discountAmnt strike-through">
                                                    {currencySymbols[currencySymbol]}{Fee}
                                                </h4>
                                                <h4 className="customHeading">
                                                    {currencySymbols[currencySymbol]}{showFee}
                                                </h4>
                                            </>
                                        ) : (
                                            <h4 className="customHeading">
                                                {currencySymbols[currencySymbol]}{showFee}
                                            </h4>
                                        )}
                                    </div>
                                    <div className="cancel-time">
                                        <span>{subscriptionPlan ? subscriptionPlan : ''}</span>
                                    </div>
                                </div>
                                <div className="card-text">
                                    <div className="content">
                                        <div className="card-text">
                                            <span>Saved Card</span>
                                        </div>
                                        <div className="card-text">
                                            <span style={{ float: "left", fontSize: "25px", marginTop: "6px" }}>**** **** **** </span>&nbsp;<span> {cardLast}</span>
                                        </div>
                                    </div>
                                    <p className="row  ChangeCard justify-content-center active" style={{ cursor: "pointer", color: "#64F259", textDecorationLine: "underline" }} onClick={handleChangeCard}>
                                        Change Card
                                    </p>
                                </div>
                                {showButton && (
                                    <div className="amount-details">
                                        <Button
                                            onClick={handleCancelSubscription}
                                            text="Cancel Subscription"
                                            icon={true}
                                            theme="light"
                                            className="w-100 book-call"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscription;
