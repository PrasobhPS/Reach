import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../utils/Utils";
import "../../components/VideoLayout/VideoLayout.scss";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useCallback, useEffect, useState } from "react";
import loaderImage from "../../assets/images/cruz/Frame.png";
import { Modal, ModalBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faFaceGrinStars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button/Button";
import { useCheckExpertRatingMutation, useUpdateExpertPaymentMutation, useExpertRatingMutation, useExtendSlotAvailableMutation, useJoinMeetingMutation, useLeftMeetingMutation } from "./VideoCallApiSlice";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import moment from "moment";
import { useBookSpecialistMutation } from "../../features/Specialist/SpecialistApiSlice";
import Swal from "sweetalert2";
import { useSocket } from "../../contexts/SocketContext";
import StarRating from "../../pages/StarRating";

interface ExtendSlotDetailsinterface {
    status: string;
    message: string;
    extended_end_time: string;
    extended_start_time: string;
    specialist_id: string;
    specialist_member_id: string;
    call_fee: string;
}

export default () => {
    const userData = getUserData('userData');
    const location = useLocation();
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [extendSlotAvailableCall] = useExtendSlotAvailableMutation();
    const [joinMeetingCall] = useJoinMeetingMutation();
    const [leftMeetingCAll] = useLeftMeetingMutation();
    const [updateExpertPayment] = useUpdateExpertPaymentMutation();
    const [checkExpertRating] = useCheckExpertRatingMutation();
    const [expertRating] = useExpertRatingMutation();
    const [BookSpecialist] = useBookSpecialistMutation();
    const { showModal, hideModal } = useGlobalModalContext();
    const [showExtendSlotModal, setShowExtendSlotModal] = useState<boolean>(false);
    const [showNoSlotModal, setShowNoSlotModal] = useState<boolean>(false);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [showExpertRatingModal, setShowExpertRatingModal] = useState<boolean>(false);
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState('');
    const [feedbackError, setFeedbackError] = useState<string>('');
    const [feedbackCompleted, setFeedbackCompleted] = useState<boolean>(false);

    const getQueryParams = () => {
        const queryParams = new URLSearchParams(location.search);
        const callDate = queryParams.get('call_date');

        return {
            meeting_id: queryParams.get('meeting_id') || 'demo',
            subject: queryParams.get('subject') || 'Reach Meet',
            call_date: callDate ? callDate : undefined,
            duration: queryParams.get('duration') || undefined,
            type: queryParams.get('type') || undefined,
            is_expert: queryParams.get('is_expert') || undefined,
        };
    };

    const postParams = location.state?.postParams ?? getQueryParams();
    const meetingId = postParams?.meeting_id ?? Date.now();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const redirectAfterCall = () => {
        if (location.state?.postParams) {
            navigate('/profile');
            window.location.reload();
        } else {
            window.close();
        }
    };

    let callDisconnectionTimeout: any = undefined;
    const notifyBeforeInMinutes = 10;
    const [isMeetingStarted, setIsMeetingStarted] = useState<boolean>(false);
    const [callDate, setCallDate] = useState<Date>();
    const [duration, setDuration] = useState<number>();
    const [meetingApi, setMeetingApi] = useState<any>();
    const [extendSlotDetails, setExtendSlotDetails] = useState<ExtendSlotDetailsinterface | undefined>(undefined);
    const [extend, setExtend] = useState<boolean>(false);

    useEffect(() => {
        setCallDate(postParams.call_date);
        setDurationInMinutes();
    }, []);

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('meetingDuration', (data: any) => {
            if (data.duration && data.meeting_id == meetingId) {
                setDuration(data.duration);
                setShowExtendSlotModal(false);
            }
        });

        return () => {
            socket.off('meetingDuration');
        };
    }, [socket, meetingId]);

    const setDurationInMinutes = useCallback((addMins: number | undefined = undefined) => {
        setDuration(duration => {
            if (duration && addMins) {
                return duration + addMins;
            } else if (postParams.duration) {
                let durationInMinutes = parseInt(postParams.duration, 10);
                return durationInMinutes < 3 ? durationInMinutes *= 60 : durationInMinutes;
            }

            return undefined;
        });
    }, [postParams.duration]);

    useEffect(() => {
        if (isMeetingStarted && callDate && duration && postParams.type == 'call' && postParams.is_expert && postParams.is_expert == 0) {
            const ukTime = new Date(callDate + " GMT+0000");
            ukTime.setMinutes(ukTime.getMinutes() + (duration - notifyBeforeInMinutes));
            let differenceInMilliseconds = ukTime.getTime() - new Date().getTime();
            differenceInMilliseconds = differenceInMilliseconds > 0 ? differenceInMilliseconds : 0;
            const warningTimeout = setTimeout(() => {
                setShowExtendSlotModal(true);
            }, differenceInMilliseconds);

            return () => {
                clearTimeout(warningTimeout);
            };
        }
    }, [isMeetingStarted, callDate, duration, postParams.type, meetingApi, postParams.is_expert]);

    useEffect(() => {
        if (meetingApi && isMeetingStarted && callDate && duration && postParams.type == 'call') {

            const ukTime = new Date(callDate + " GMT+0000");
            ukTime.setMinutes(ukTime.getMinutes() + duration);
            let differenceInMilliseconds = ukTime.getTime() - new Date().getTime();
            differenceInMilliseconds = differenceInMilliseconds > 0 ? differenceInMilliseconds : 0;

            callDisconnectionTimeout = setTimeout(() => {
                meetingApi.executeCommand('endConference');
            }, differenceInMilliseconds);

            return () => {
                clearTimeout(callDisconnectionTimeout);
            };
        }
    }, [isMeetingStarted, callDate, duration, meetingApi, postParams.type]);

    const handleExtendMeetingTime = async () => {
        setShowExtendSlotModal(false);

        if (meetingId) {
            const params = {
                meeting_id: meetingId
            };

            const response: any = await extendSlotAvailableCall(params);

            if ("error" in response) {
                console.error(JSON.stringify(response.error));
                return;
            } else {
                const result = response.data;
                setExtendSlotDetails(result);
                setExtend(true)
            }
        }
    };

    useEffect(() => {
        if (showPaymentModal) {
            showModal(MODAL_TYPES.PAYMENT_MODAL, {
                onCloseCallback: handlePaymentSubmit,
                handleSubmit: (stripeToken: any) => {
                    handlePaymentSubmit(stripeToken);
                },
                hideInstruction: true,
                amount: extendSlotDetails?.call_fee
            });
        }
    }, [showPaymentModal]);

    const handleShowPaymentFailed = () => {
        Swal.fire({
            title: "Payment Failed",
            text: "There was an issue processing your payment. Please try again.",
            icon: "error",
            showConfirmButton: true,
            confirmButtonText: "OK",
            backdrop: `rgba(255, 255, 255, 0.5) left top no-repeat filter: blur(5px);`,
            background: '#fff',
        });
    };

    const handlePaymentSubmit = useCallback(async (stripeToken: any) => {
        if (stripeToken === 'Error') {
            handleShowPaymentFailed();
            return false;
        }


    }, [extendSlotDetails, userData, meetingId]);

    useEffect(() => {
        if (!extendSlotDetails && extend) return;
        extendCall()
    }, [extendSlotDetails, extend])

    const extendCall = async () => {
        setIsLoading(true);
        try {
            if (extendSlotDetails) {
                hideModal();
                const selectedDate = moment(extendSlotDetails.extended_start_time).format("YYYY-MM-DD");
                const selectedTime = moment(extendSlotDetails.extended_start_time).format("HH:mm");
                const response = await BookSpecialist({
                    specialist_id: extendSlotDetails.specialist_id,
                    call_scheduled_date: selectedDate,
                    call_scheduled_time: selectedTime,
                    call_scheduled_timezone: "Europe/London",
                    call_scheduled_reason: null,
                    type: 'AutoBooking',
                    timeSlot: "30 min",
                    call_status: 'A',
                    is_member: 1,
                    currency: userData?.currency,
                    meeting_id: meetingId,
                    member_id: userData?.Member_id,
                });

                if ("error" in response) {
                    handleShowPaymentFailed();
                    console.error("Error while extending call time: ", JSON.stringify(response.error));
                } else {
                    const newDuration = duration ? duration + 30 : undefined;

                    if (newDuration) {
                        // updateExpertPayment({meeting_id: meetingId})
                        setDuration(newDuration);
                    }

                    Swal.fire({
                        title: "Payment Done!",
                        text: "Meeting time has been extended as a new slot",
                        icon: "success",
                        timer: 5000,
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        backdrop: `rgba(255, 255, 255, 0.5) left top no-repeat filter: blur(5px);`,
                        background: '#fff',
                    });

                    if (newDuration) {
                        socket?.emit('meetingDuration', {
                            to_member_id: userData?.Member_id,
                            meeting_id: meetingId,
                            duration: newDuration
                        });

                        socket?.emit('meetingDuration', {
                            to_member_id: extendSlotDetails.specialist_member_id,
                            meeting_id: meetingId,
                            duration: newDuration
                        });
                    }
                    setExtendSlotDetails(undefined)
                    setExtend(false);
                }
            }
        } catch (error) {
            console.error("Error while extend call: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleJoinMeetingCall = useCallback(async () => {
        if (userData?.Member_id && meetingId) {
            await joinMeetingCall({
                meeting_id: meetingId,
                member_id: userData.Member_id,
            });
        }
    }, [meetingId, userData?.Member_id]);

    const handleLeftMeetingCall = useCallback(async () => {
        if (userData?.Member_id && meetingId) {
            await leftMeetingCAll({
                meeting_id: meetingId,
                member_id: userData.Member_id,
            });
            // updateExpertPayment({meeting_id: meetingId})
        }
    }, [meetingId, userData?.Member_id]);

    const handleExpertRating = async () => {

        setFeedbackError('');

        if (!feedback.trim()) {
            setFeedbackError('We value your feedback! Kindly share your experience.');
            return;
        }

        if (!rating) {
            setFeedbackError('Please select a star rating to help us improve.');
            return;
        }

        setFeedbackCompleted(true);

        await expertRating({
            meeting_id: meetingId,
            rating,
            review: feedback
        })

        setTimeout(() => {
            redirectAfterCall();
            handleLeftMeetingCall();
        }, 2500);

    }

    const completeCall = async () => {

        if (postParams.is_expert !== '1' && postParams.type == 'call') {
            let expertRating: any = await checkExpertRating({
                meeting_id: meetingId,
                member_id: userData?.Member_id,
            });
            if (!expertRating.data.success) {
                setShowExpertRatingModal(true);
                return
            }
        }

        handleLeftMeetingCall();
        redirectAfterCall();
    }

    return (
        <>
            <div>
                <JitsiMeeting
                    domain={process.env.REACT_APP_MEETING_URL}
                    roomName={meetingId}
                    jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJyZWFjaF9hcHBfaWQiLCJpc3MiOiJyZWFjaF9hcHBfaWQiLCJzdWIiOiJiZXRhMi5yZWFjaC5ib2F0cyIsInJvb20iOiIqIn0.s0yimMdQQUuUv6TBQdkwl8wlaKhq5sClj11rBO29Is0"
                    configOverwrite={{
                        startWithAudioMuted: true,
                        startWithVideoMuted: false,
                        disableDeepLinking: true,
                        prejoinPageEnabled: false,
                        hideConferenceSubject: true,
                    }}
                    userInfo={{
                        displayName: userData?.Member_fullname || 'Guest',
                        email: ''
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.className = "iframe-div";

                        const parentDiv = iframeRef.parentNode as HTMLDivElement;

                        if (parentDiv) {
                            parentDiv.classList.add('videolayout-parent');
                        }
                    }}
                    onApiReady={(externalApi) => {
                        externalApi.addListener('videoConferenceLeft', () => {
                            completeCall();
                        });

                        externalApi.addListener("toolbarButtonClicked", function (event) {
                            if (event.key == "hangup-menu") {
                                externalApi.executeCommand('hangup');
                            }
                        });

                        externalApi.addListener('videoConferenceJoined', () => {
                            setIsLoading(false);
                            setIsMeetingStarted(true);
                            setMeetingApi(externalApi);
                            handleJoinMeetingCall();
                        });

                        if (userData?.members_profile_picture) {
                            externalApi.executeCommand('avatarUrl', userData.members_profile_picture);
                        }
                    }}
                />
            </div>
            {isLoading && (
                <div className="page-loader">
                    <div className="page-innerLoader">
                        <div className="spinner-border" role="status">
                            <img src={loaderImage} alt="Loading..." className="img-fluid" />
                        </div>
                    </div>
                </div>
            )}
            <div>
                <Modal isOpen={showExtendSlotModal} centered className="Remove-alert confirm-modal videolayout-modal" >
                    <ModalBody>
                        <div className="confirm-box">
                            <div className="confirm-box-inner">
                                <div className="row  mx-0">
                                    <div className="row content-box-new  justify-content-center">
                                        <span className="icon-info">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />
                                        </span>
                                        <p className="row justify-content-center text-center">
                                            Your meeting will be expired within 10 minutes.
                                            You may have to pay additional call extension fee.
                                            Do you want to continue the meeting?
                                        </p>
                                    </div>
                                    <div className="row content-box-new justify-content-center">
                                        <div className="col-md-4">
                                            <Button
                                                onClick={handleExtendMeetingTime}
                                                text="Yes"
                                                icon={false}
                                                theme="light"
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <Button
                                                onClick={() => setShowExtendSlotModal(false)}
                                                text="No"
                                                icon={false}
                                                theme="dark"
                                                className="w-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal isOpen={showNoSlotModal} toggle={() => setShowNoSlotModal(false)} centered className="Remove-alert confirm-modal videolayout-modal" >
                    <ModalBody>
                        <div className="confirm-box">
                            <div className="confirm-box-inner">
                                <div className="row  mx-0">
                                    <div className="row content-box-new  justify-content-center">
                                        <p className="row justify-content-center text-center">No slot available to extend the meeting</p>
                                    </div>
                                    <div className="row content-box-new justify-content-center">
                                        <div className="col-md-4">
                                            <Button
                                                onClick={() => setShowNoSlotModal(false)}
                                                text="Ok"
                                                icon={false}
                                                theme="dark"
                                                className="w-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            <div>
                <Modal isOpen={showExpertRatingModal} centered className="Remove-alert confirm-modal videolayout-modal" >
                    <ModalBody>
                        <div className="confirm-box">
                            <div className="confirm-box-inner">
                                <div className="row  mx-0">
                                    <div className="row content-box-new  justify-content-center">
                                        <span className="icon-info">
                                            <FontAwesomeIcon icon={faFaceGrinStars} className="text-warning" />
                                        </span>
                                        <h3 className="row justify-content-center text-center">
                                            Rate your expert!
                                        </h3>
                                    </div>
                                    <div className="row justify-content-center text-center">
                                        <div className="rating-star mb-3">
                                            <StarRating
                                                onClick={(rate: number) => { setRating(rate) }}
                                                size={30}
                                            />
                                        </div>
                                        {!feedbackCompleted && (
                                            <form>
                                                <textarea
                                                    rows={4}
                                                    cols={20}
                                                    className="form-control mb-3"
                                                    placeholder="Write your feedback here..."
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)} >
                                                </textarea>
                                            </form>
                                        )}
                                        {feedbackCompleted && (
                                            <div>
                                                <p className="text-warning">{feedback}</p>
                                                <h3 className="row justify-content-center text-center text-success">
                                                    Thank you for your feedback!
                                                </h3>
                                            </div>
                                        )}
                                        {feedbackError && (
                                            <div>
                                                <p className="text-danger">{feedbackError}</p>
                                            </div>
                                        )}
                                    </div>
                                    {!feedbackCompleted && (
                                        <div className="row content-box-new justify-content-center">
                                            <div className="col-md-4">
                                                <Button
                                                    onClick={() => { redirectAfterCall(); handleLeftMeetingCall() }}
                                                    text="Ask me later"
                                                    icon={false}
                                                    theme="light"
                                                    className="w-100"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Button
                                                    onClick={() => handleExpertRating()}
                                                    text="Submit"
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

        </>
    );
};
