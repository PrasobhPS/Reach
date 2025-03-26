import React, { useEffect, useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button/Button";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./MyReferrals.scss";
import CustomInput from "../../components/CustomInput/CustomInput";
import { CDBCard, CDBCardBody, CDBDataTable, CDBContainer, CDBRow, CDBCol } from 'cdbreact';
import { useProfileMutation, useReferralListQuery, useCreateStripeAccountMutation, useRedeemAmountMutation } from "./profileApiSlice";
import { ProfileData, initialProfileData } from "../../types/ProfileData";
import { getUserData } from "../../utils/Utils";
import { QRCodeSVG } from "qrcode.react";
import Swal from "sweetalert2";
interface UserData {
    Member_fullname: string;
    Member_type: string;
    Token: string;
    members_profile_picture: string;
    Member_id: string;
    IsEmployer: string;
    IsEmployee: string;
    is_specialist: string;
}
interface ReferralData {
    id: number | null;
    amount: string;
    members_email: string;
    members_fname: string;
    members_lname: string;
    members_type: string;
    referred_at: string;
    status: string;
    currency: string;
    stripe_url: string;
    stripe_varify: boolean;
}

interface CreateStripeResponse {
    success: boolean;
    account_link: string;
    message: string;
}
export const MyReferrals = () => {
    const { data: referalData, error, isLoading, isSuccess, refetch } = useReferralListQuery({});

    const [buttonCopied, setbuttonCopied] = useState<"dark" | "light" | "grey">('light');
    const [urlCopied, seturlCopied] = useState<"dark" | "light" | "grey">('light');
    const [buttonDisable, setbuttonDisable] = useState<boolean>(false);
    const [urlDisable, seturlDisable] = useState<boolean>(false);
    const userData = getUserData("userData");
    const [createStripe] = useCreateStripeAccountMutation({});
    const [referralDetails, setReferralDetails] = useState<ReferralData[]>([]);
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [availableRewards, setAvailableRewards] = useState<number>(0);
    const [referralBonus, setReferralBonus] = useState<number>(0);
    const [referral_code, setReferral_code] = useState<string>('');
    const [stripeVarify, setStripeVarify] = useState<boolean>(false);
    const [stripeUrl, setStripeUrl] = useState('');
    const currencySymbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
    };
    let token = "";
    let memberType = "";
    let currencySymbol = "GBP";
    try {
        if (userData !== null) {
            token = userData.Token;
            memberType = userData.Member_type;
            currencySymbol = userData.currency ? userData.currency : "GBP";

        } else {
            console.error("User data not found in local storage");
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }
    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if (isSuccess && referalData) {
            setReferralDetails(referalData.data);
            setTotalRewards(referalData.total_rewards);
            setAvailableRewards(referalData.available_rewards);
            setReferralBonus(parseInt(referalData.referral_bonus));
            setReferral_code(referalData.referral_code);
            setStripeVarify(referalData.stripe_varify);
            setStripeUrl(referalData.stripe_url);
        }

    }, [isSuccess, referalData]);

    const handleCopyClick = (couponCode: string | undefined, from: string) => {
        if (!couponCode) {
            console.error("Coupon code is empty");
            return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(couponCode)
                .then(() => {
                    if (from === 'url') {
                        seturlCopied('grey');
                        seturlDisable(true);
                        setbuttonCopied('light');
                        setbuttonDisable(false);
                    } else {
                        setbuttonCopied('grey');
                        setbuttonDisable(true);
                        seturlCopied('light');
                        seturlDisable(false);
                    }

                })
                .catch((error) => {
                    console.error("Failed to copy text to clipboard:", error);
                });
        } else {
            console.error("Clipboard API not available");
            fallbackCopyTextToClipboard(couponCode, from);
        }
    };
    const fallbackCopyTextToClipboard = (text: string, from: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            if (from === 'url') {
                seturlCopied('grey');
                seturlDisable(true);
                setbuttonCopied('light');
                setbuttonDisable(false);
            } else {
                setbuttonCopied('grey');
                setbuttonDisable(true);
                seturlCopied('light');
                seturlDisable(false);
            }
        } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
    };

    const handleSubmit = async () => {
        if (!stripeVarify && stripeUrl !== '') {
            //console.log('test-----');

        } else {
            const response: CreateStripeResponse = await createStripe({}).unwrap();
            if (response.success && response.account_link) {
                window.location.replace(response.account_link);
            } else {
                console.error("Failed to create Stripe account:", response.message);
            }
        }

    };

    const [redeemAmount] = useRedeemAmountMutation();
    const handleRedeem = async () => {
        if (availableRewards > 25) {
            let formData = {
                withdraw_amount: availableRewards,
                currency: currencySymbol
            }
            const response = await redeemAmount(formData).unwrap();
            if (response.success) {
                //console.log(response.success);
            }
        } else {
            Swal.fire({
                title: "",
                text: "You need minmum amount of 25 to redeem",
                icon: "warning",
                showConfirmButton: true,
                backdrop: `
                rgba(255, 255, 255, 0.5)
                left top
                no-repeat
                filter: blur(5px);
              `,
                background: '#fff',
            });
        }

    }

    const data = () => {
        return {
            columns: [
                {
                    label: 'Date',
                    field: 'name',
                    width: 150,
                    attributes: {
                        'aria-controls': 'DataTable',
                        'aria-label': 'Name',
                    },
                },
                {
                    label: 'Referral',
                    field: 'position',
                    width: 270,
                },
                {
                    label: 'Status',
                    field: 'Status',
                    sort: 'asc',
                    width: 100,
                },
            ],
            rows: referralDetails.map((item: ReferralData) => ({
                name: item.referred_at || 'N/A',
                position: item.members_email || 'N/A',
                Status: (
                    <span className={item.status === 'P' ? "status-pending" : "status-completed"}>
                        {currencySymbols[item.currency]}{item.amount ? parseFloat(item.amount).toFixed(2) : '0.00'}
                        <span>{item.status === 'P' ? 'Pending' : 'Earned'}</span>
                    </span>
                ),
            })),
        };
    };


    return (
        <div className="MyRefferals-page">
            <div className="container">
                <div className="row">
                    {/* <div className="col-md-6 col-sm-12">
                        <div className="card-content">
                            <div className="card-content-head">
                                <div className="heading">
                                    <div className="content-head">
                                        <label className="title">Total Rewards</label>
                                        <h3 className="customHeading text-end">{currencySymbols[currencySymbol]}{totalRewards}</h3>
                                    </div>
                                    <div className="content-head AvailabletoRedeem">
                                        <label className="title">Available to Redeem</label>
                                        <h3 className="customHeading text-end">{currencySymbols[currencySymbol]}{availableRewards}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="redeem-option">
                                {stripeVarify ? (
                                    <Button
                                        onClick={() => handleRedeem()}
                                        text="Redeem Reward"
                                        icon={true}
                                        theme="light"
                                        className="w-100"
                                    />
                                ) : (!stripeVarify && stripeUrl !== '') ? (
                                    < Button
                                        onClick={() => handleSubmit()}
                                        text="Connect Stripe Account"
                                        icon={true}
                                        theme="light"
                                        className="w-100"
                                    />
                                ) : (
                                    <Button
                                        onClick={() => handleSubmit()}
                                        text="Connect Stripe Account"
                                        icon={true}
                                        theme="light"
                                        className="w-100"
                                    />
                                )}

                            </div>
                            <div className="RedemptionRequirement">
                                <h2 className="customHeading">Redemption Requirement</h2>
                                <p>A minimum of {currencySymbols[currencySymbol]}25 is required to redeem your funds.</p>
                            </div>
                            <div className="divider"></div>
                        </div>
                    </div> */}
                    <div className="col-md-12 col-sm-12">
                        <div className="card-content url-card">
                            <div className="card-content-head">
                                <div className="ReferralCode-options pb-0">
                                    <label className="labelhead">Referral Code</label>
                                    <div className="ReferralCode-text">
                                        {memberType === 'M' ? (
                                            <>
                                                <div className="ReferralCode">
                                                    <span>{referral_code}</span>
                                                </div>
                                                <div className="copy-code">
                                                    <Button
                                                        onClick={() => handleCopyClick(referral_code, 'code')}
                                                        text={"Copy Code"}
                                                        icon={true}
                                                        iconname={faCopy}
                                                        className="copycode"
                                                        theme={buttonCopied}
                                                        disabled={buttonDisable}
                                                    />
                                                </div>
                                            </>
                                        ) : ""}
                                    </div>
                                </div>
                                <div className="ReferralCode-options">
                                    <label className="labelhead">Referral Url</label>

                                    <div className="ReferralCode-text">
                                        {memberType === 'M' ? (
                                            <>
                                                <div className="ReferralCode">
                                                    <span>{`${window.location.origin}/joinmembership/${referral_code}`}</span>
                                                </div>
                                                <div className="copy-code">
                                                    <Button
                                                        onClick={() => handleCopyClick(`${window.location.origin}/joinmembership/${referral_code}`, 'url')}
                                                        text={"Copy Code"}
                                                        icon={true}
                                                        className="copycode"
                                                        iconname={faCopy}
                                                        theme={urlCopied}
                                                        disabled={urlDisable}
                                                    />
                                                </div>
                                            </>
                                        ) : ""}
                                    </div>

                                </div>
                                <div className="divider-green"></div>
                                <div className="RedemptionRequirement d-flex align-items-center">
                                    {memberType === 'M' ? (
                                        <div className="qrcode">
                                            <QRCodeSVG value={`${window.location.origin}/joinmembership/${referral_code}`} />
                                        </div>
                                    ) : ""}
                                    <div className="d-block qr-codetext">
                                        <h2 className="customHeading d-block">Refer friends & earn up to {referralBonus}%</h2>
                                        <p>Receive {referralBonus}% wish cash for each referral after their Joining</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {referralDetails && referralDetails.length > 0 ? (
                        <div className="col-md-12 col-sm-12">
                            <div className="referral-table">
                                <div className="table-heading">
                                    <div className="Referral-table">
                                        <CDBContainer>
                                            <h2 className="Referral">Referral Status</h2>
                                            <CDBRow>
                                                <CDBCol md="12" className="table-content">
                                                    <CDBCard>
                                                        <CDBCardBody>
                                                            <CDBDataTable
                                                                striped
                                                                bordered
                                                                hover
                                                                entriesOptions={[5, 20, 25]}
                                                                entries={5}
                                                                pagesAmount={4}
                                                                data={data()}
                                                                materialSearch={false}
                                                                responsive
                                                                searching={false}
                                                            />
                                                        </CDBCardBody>
                                                    </CDBCard>
                                                </CDBCol>
                                            </CDBRow>
                                        </CDBContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginBottom: "20px" }}></div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyReferrals;
