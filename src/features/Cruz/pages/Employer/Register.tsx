import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Button } from '../../../../components/Button/Button';
import { useEmployerVarificationMutation, useGetVarificationStatusMutation } from '../../Api/CampaignApiSlice';
import { EmployerRegister } from '../../components/EmployerRegister/EmployerRegister';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Heading } from '../../../../components/Heading/Heading';
import "../../components/EmployerRegister/EmployerRegister.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSaveJobMutation } from '../../Api/CruzMainApiSlice';

export const Register = () => {

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showLoaderMessage, setShowLoaderMessage] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<boolean>(false);
    const [employerVarification] = useEmployerVarificationMutation();
    const [getVarificationStatus] = useGetVarificationStatusMutation();
    const [saveJob] = useSaveJobMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const { jobId, jobRole } = location.state || {};
    const handleSubmit = async () => {
        let job_status = 'D';
        if (verificationStatus) {
            job_status = 'A';
        }
        let formData = {
            id: jobId,
            job_role: jobRole,
            job_status: job_status,
        }
        const response = await saveJob(formData);
        if (job_status === 'A') {
            navigate('/cruz/viewcampaign/livecampaign');
        } else {
            navigate('/cruz/viewcampaign/draftcampaign');
        }

    }

    const BtnSave = async () => {
        try {
            let job_status = 'D';

            let formData = {
                id: jobId,
                job_role: jobRole,
                job_status: job_status,
            }
            const response = await saveJob(formData);

            navigate('/cruz/viewcampaign/draftcampaign');
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    };


    const handleGoBack = () => {
        navigate(-1);
    };
    const handleUpload = async () => {
        setShowLoaderMessage(true);
        setVerificationStatus(false);

        try {
            // Call backend to create verification session
            const response = await employerVarification({});
            if ('data' in response) {
                const data = response.data;

                const stripePromise = loadStripe(data.client_secret);

                const stripe = await stripePromise;

                // Initiate Stripe verification
                if (stripe) {
                    const { error } = await stripe.verifyIdentity(data.client_secret);

                    if (error) {
                        console.error('Verification failed:', error);
                        setShowSuccessMessage(true);
                        setVerificationStatus(false);
                    } else {

                        const varifyResponse = await getVarificationStatus({});
                        if ('data' in varifyResponse) {
                            setShowLoaderMessage(true);
                            setShowSuccessMessage(true);
                            const status = varifyResponse.data;
                            if (status.is_doc_verified) {
                                setVerificationStatus(true);
                            } else {
                                setVerificationStatus(false);
                            }

                        } else {
                            setShowLoaderMessage(true);
                            setShowSuccessMessage(true);
                            setVerificationStatus(false);
                        }
                    }
                }
            }


        } catch (error) {
            console.error('Error creating verification session:', error);
            setVerificationStatus(false);
        }

    };

    return (
        <div className="cruz-register cruz-registerparent">
            <div className="container">
                <div className="row  cruz-registerinner-content">
                    <div className="col-xl-6 col-12">
                        <div className="page-path">
                            <div className="parent-direction">
                                <label>Campaigns</label>
                            </div>
                            <span className="direction-arrow">
                                <FontAwesomeIcon icon={faAngleRight} />
                            </span>

                        </div>
                        <div className="step-verification">
                            <span>Final Step - Verification</span>
                        </div>
                        {!showLoaderMessage && (
                            <div className="employer-register">
                                <Heading>register and VERIFY AS AN EMPLOYER</Heading>
                                <p className="text-para">
                                    To post job opportunities we require all employers to verify their
                                </p>
                                <div className="registration-form">
                                    <h2 className="customHeading">VERIFY IDENTITY</h2>
                                    <div className="description-text">
                                        <p>To protect our members, before we make your advert live please verify your identity. You will only have to do this once.</p>
                                    </div>
                                    <div className="proofUpload">
                                        <Button
                                            onClick={handleUpload}
                                            text="Verify Identity"
                                            theme="light"
                                            className="w-100"
                                        />
                                    </div>

                                </div>
                            </div>
                        )}
                        {showLoaderMessage && (
                            <div className="waiting-page">
                                <div className="contents-page">
                                    {!showSuccessMessage ? (
                                        <div className="Wait-section">
                                            <h2 className="customHeading">Please Wait</h2>
                                            <div className="details">
                                                <span>We’re just confirming your details.</span>
                                            </div>
                                            <div className="page-innerLoader">
                                                <div className="spinner-border" role="status">
                                                    <img
                                                        src={require("../../../../assets/images/cruz/Frame.png")}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="content-txt">
                                                    <span>CHECKING...</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {showSuccessMessage ? (
                                        verificationStatus ? (
                                            <div className="success-message">
                                                <h2 className="customHeading">Success</h2>
                                                <p>Your details have been confirmed.</p>
                                            </div>
                                        ) : (
                                            <div className="sorry-message">
                                                <h2 className="customHeading">Sorry</h2>
                                                <p>Your details don’t match.</p>
                                                <p>Please get in touch with a member of the REACH team to discuss.</p>
                                            </div>
                                        )
                                    ) : null}
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="col-xl-6 col-12">
                        <div className="action-field">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-content">
                                        <div className="btn-action">
                                            <Button
                                                onClick={() => handleSubmit()}
                                                text="Continue"
                                                icon={true}
                                                theme="light"
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="action-button">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="goback">
                                                    <a style={{ cursor: "pointer" }} onClick={handleGoBack}>Go back</a>


                                                </div>
                                                <div className="goback">
                                                    <a style={{ cursor: "pointer" }} onClick={BtnSave}>Save and exit</a>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Register;
