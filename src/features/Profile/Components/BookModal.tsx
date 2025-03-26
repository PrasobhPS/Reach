import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { MODAL_TYPES, useGlobalModalContext } from "../../../utils/GlobalModal";
import moment from "moment";
import { useBookSpecialistMutation, useCallScheduleMutation, useGetMemberCardDetailsQuery, useReserveCallMutation, useUpdateBookingStatusMutation } from "../../Specialist/SpecialistApiSlice";
import { useScheduleInterviewMutation } from "../../Cruz/Api/InterviewApiSlice";
import { HorizontalCalender } from "../../../components/Date/HorizontalCalender";
import { CustomTimePicker } from "../../../components/Timepicker/CustomTimePicker";
import { Button } from "../../../components/Button/Button";
import defaultImage from '../../../assets/images/profile/Default.jpg';
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";
import Swal from "sweetalert2";
import { getUserData } from "../../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
interface BookingProps {
    userId?: string;
    specialistName?: string;
    specialistLastName?: string;
    timeSlot: '1 hour' | '1hr' | '30 min';
    specialistDp: string | null;
    reason?: string;
    isOpen: boolean;
    toggleClose: () => void;
    changeTimeSlot: (timeslot: any) => void;
    bookingId?: string;
    from?: string;
    interviewStatus?: string;
    isRearrange?: boolean;
    specialistFee?: number;
}
type Currency = "USD" | "GBP" | "EUR";
const today = moment().toDate();
export const BookModal = (props: BookingProps) => {
    const { userId, specialistName, specialistLastName, timeSlot, specialistDp, reason, isOpen, toggleClose, changeTimeSlot, bookingId, from, interviewStatus, isRearrange, specialistFee } = props;
    const userData = getUserData('userData');
    const currencySymbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
    };
    const { data: cardDetails, isSuccess, isLoading: cardLoading } = useGetMemberCardDetailsQuery({});
    const [cardLast, setCardLast] = useState<string>('0');
    useEffect(() => {
        if (isSuccess && cardDetails) {
            setCardLast(cardDetails.last_4);
        }
    }, [cardDetails, isSuccess])
    const [modal, setModal] = useState(false);
    const [callSheduleDate, setCallScheduleDate] = useState<Date | null>(today);
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);
    const [selectedTime, setSelectedTime] = useState<string | null>();
    const [SelectedTimezone, setSelectedTimezone] = useState<string>('Europe/London');
    const [callSchedule] = useCallScheduleMutation();
    const [reserveACall] = useReserveCallMutation();
    const [updateBookingStatus] = useUpdateBookingStatusMutation();

    const [interviewSchedule] = useScheduleInterviewMutation();
    const [ErrorMsg, setErrorMsg] = useState("");
    const [SuccessMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [bookedTimes, setTimes] = useState<string[]>([]);
    const [BookSpecialist] = useBookSpecialistMutation();
    const [specialistCallRate, setSpecialistCallRate] = useState<Record<string, string>>({})
    const [specialistfee, setSpecialistFees] = useState<string>('');

    const [showTimeSlot, setShowTimeSlot] = useState<'1 hour' | '1hr' | '30 min' | '30min'>(timeSlot);
    const [BtnText, setBtnText] = useState<string>('Confirm Date and Pay');
    const [currencySymbol, setCurrencySymbol] = useState<string>('£');
    const [currentCurrency, setCurrentCurrency] = useState<Currency>('GBP');
    const { hideModal, store } = useGlobalModalContext();
    const [call_status, setCallStatus] = useState<string>('P');
    const [isMember, setIsMember] = useState(1);
    const [showScheduleNow, setShowScheduleNow] = useState<boolean>(false);
    const [bookingType, setBookingType] = useState<string>('');
    const [reserveId, setReserveId] = useState<number>(0);
    const navigate = useNavigate();
    const fetchAvailableTime = async (date: moment.MomentInput) => {
        setIsLoading(true);
        try {
            const formattedDate = moment(date).format("YYYY-MM-DD");
            if (from !== 'interview') {
                const response = await callSchedule({
                    specialist_id: userId,
                    call_scheduled_date: formattedDate,
                    timeSlot: showTimeSlot,
                });
                if ('data' in response) {
                    const call_rates = response.data?.call_rates;
                    const getCurrency = response.data?.currency;
                    const symbol = currencySymbols[getCurrency];
                    setCurrentCurrency(getCurrency);
                    setCurrencySymbol(symbol);
                    setSpecialistCallRate(call_rates);
                    if (from !== 'Expert') {
                        setSpecialistFees(symbol + parseFloat(call_rates['one']));
                    }
                    if (isRearrange) {
                        setSpecialistFees(symbol + specialistFee);
                    }

                } else {
                    // If the response is an error, handle the error case
                    console.error('Error response:', response.error);
                }
            }
        } catch (error) {
            console.error('Failed to fetch specialist list:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (today && isOpen) {
            fetchAvailableTime(today);
        }
        if (from === 'Expert') {
            setCallStatus('R');
            setIsMember(0);
            setBtnText('Confirm')
        }
        if (from === 'interview') {
            setShowScheduleNow(true);
            setBtnText('Confirm Interview');
        }
    }, [today, isOpen, from]);

    const toggle = () => {
        if (modal) {
            setSelectedDate(today);
            setSelectedTime(null);
            setErrorMsg("");
            setSuccessMsg("");

            if (today) {
                handleDateSelect(today);
            }
        }
        setModal(!modal);
    };

    const handleChangeCard = async (reserveBookingId: any) => {
        let timeAmount = parseFloat(specialistCallRate['one']);
        if (showTimeSlot === '30 min' || showTimeSlot === '30min') {
            timeAmount = parseFloat(specialistCallRate['half']);
        }
        setBookingType('');
        showModal(MODAL_TYPES.PAYMENT_MODAL, {
            currencySymbol: currencySymbol,
            amount: timeAmount,
            onCloseCallback: handleSubmit,
            handleSubmit: (stripeToken: any) => {
                handleSubmit(stripeToken, reserveBookingId);
            }
        });
    }

    const handleDateSelect = async (date: Date) => {
        setSelectedDate(date);
        setCallScheduleDate(date);
        setIsLoading(true);
        try {
            const formattedDate = moment(date).format("YYYY-MM-DD");

        } catch (error) {
            console.error("Failed to schedule call:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
    };

    const changeTimeSlotHere = (timeSlotChange: any) => {
        changeTimeSlot(timeSlotChange);
        if (specialistCallRate) {
            let timeAmount = parseFloat(specialistCallRate['one']);
            if (timeSlotChange === '30 min' || timeSlotChange === '30min') {
                timeAmount = parseFloat(specialistCallRate['half']);
            }
            if (from !== 'Expert') {
                setSpecialistFees(currencySymbol + timeAmount);
            }
        }
        setShowTimeSlot(timeSlotChange);

    };
    const [modal2Open, setModal2Open] = useState(false);
    const { showModal } = useGlobalModalContext();
    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
            let convertedTime = "";
            if (selectedTime) {
                convertedTime = moment(selectedTime, "hh:mm A").format("hh:mm A");
                if (bookingId) {
                    handleSubmit('');
                } else {
                    const data = {
                        specialist_id: userId,
                        call_scheduled_date: formattedDate,
                        call_scheduled_time: convertedTime,
                        call_scheduled_timezone: SelectedTimezone,
                        call_scheduled_reason: reason,
                        timeSlot: showTimeSlot,
                        call_status: call_status,
                        currency: currentCurrency,

                    };
                    const response = await reserveACall(data);
                    if ("error" in response) {

                        let text = 'Please try again';
                        if (typeof response.error === "string") {
                            text = response.error
                        } else {
                            const fetchError = response.error as FetchBaseQueryError; // Type assertion
                            if (
                                fetchError.data &&
                                typeof fetchError.data === "object" &&
                                "error" in fetchError.data &&
                                typeof fetchError.data.error === "string"
                            ) {
                                text = fetchError.data.error
                            } else {
                                console.log("An error occurred"); // Handle cases where error property doesn't exist
                            }
                        }

                        setErrorMsg(text);


                    } else {
                        let reserveBookingId = response.data.booking_id || 0;
                        setReserveId(reserveBookingId);
                        setBookingType('AutoBooking');

                        showModal(MODAL_TYPES.CONFIRM_MODAL, {
                            title: "BOOK A CALL",
                            details: "Are you sure you want to book a call with card",
                            cards: cardLast,
                            confirmBtn: "Confirm",
                            handleSubmit: () => {
                                handleSubmit('', reserveBookingId);
                            },
                            handleChangeCard: () => {
                                handleChangeCard(reserveBookingId);
                            }
                        });
                    }
                }

            } else {
                setErrorMsg("Please select a Time before booking");
            }

        } catch (error) {
            console.error("Failed to fetch specialist list:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSubmit = async (stripeToken: any, bookingIdFromReserve?: number) => {

        if (stripeToken === 'Error') {
            return false;
        }
        setIsLoading(true);
        setModal2Open(!modal2Open);

        try {
            hideModal();
            const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
            let convertedTime = "";
            if (selectedTime) {
                convertedTime = moment(selectedTime, "hh:mm A").format("hh:mm A");
            } else {
                console.log("selectedTime is null or undefined");
            }
            if (from !== 'interview') {
                let bookType = '';
                if (!stripeToken) {
                    bookType = 'AutoBooking';
                }
                if (bookingId) {
                    const updateResponse = await BookSpecialist({
                        specialist_id: userId,
                        call_scheduled_date: formattedDate,
                        call_scheduled_time: convertedTime,
                        call_scheduled_timezone: SelectedTimezone,
                        call_scheduled_reason: reason,
                        stripeToken: stripeToken,
                        timeSlot: showTimeSlot,
                        booking_id: bookingId,
                        call_status: call_status,
                        is_member: isMember,
                        currency: currentCurrency,
                        type: bookType,

                    });

                    if ("error" in updateResponse) {

                        let text = 'Please try again';
                        if (typeof updateResponse.error === "string") {
                            text = updateResponse.error
                        } else {
                            const fetchError = updateResponse.error as FetchBaseQueryError; // Type assertion
                            if (
                                fetchError.data &&
                                typeof fetchError.data === "object" &&
                                "error" in fetchError.data &&
                                typeof fetchError.data.error === "string"
                            ) {
                                text = fetchError.data.error
                            } else {
                                console.log("An error occurred"); // Handle cases where error property doesn't exist
                            }
                        }


                    } else {
                        let transactionId = updateResponse.data.data.transactionId;
                        let title = 'New Time Proposed';
                        let text = `Awaiting confirmation from user`;
                        Swal.fire({
                            title: `${title}`,
                            text: `${text}`,
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

                        setErrorMsg("");
                        const textarea = document.getElementById('call_scheduled_reason') as HTMLTextAreaElement | null;
                        if (textarea) {
                            textarea.value = '';
                        }
                        setTimeout(() => {
                            toggle(); // Close the modal
                            setSuccessMsg(""); // Clear success message
                        }, 50);

                        toggleClose();
                    }

                }
                else {
                    const bookingIdToUse = reserveId || bookingIdFromReserve;
                    const dataSave = {
                        booking_id: bookingIdToUse,
                        type: bookType,
                        stripeToken: stripeToken,
                    };
                    const updateResponse = await updateBookingStatus(dataSave);

                    if ("error" in updateResponse) {

                        let text = 'Please try again';
                        if (typeof updateResponse.error === "string") {
                            text = updateResponse.error
                        } else {
                            const fetchError = updateResponse.error as FetchBaseQueryError; // Type assertion
                            if (
                                fetchError.data &&
                                typeof fetchError.data === "object" &&
                                "error" in fetchError.data &&
                                typeof fetchError.data.error === "string"
                            ) {
                                text = fetchError.data.error
                            } else {
                                console.log("An error occurred"); // Handle cases where error property doesn't exist
                            }
                        }



                        navigate(`/booking/unsuccessful`,
                            {
                                state: {
                                    transactionId: '',
                                    expertFName: specialistName,
                                    expertLName: specialistLastName,
                                    specialistfee: specialistfee,
                                    message: text,
                                }
                            });
                    } else {
                        let transactionId = updateResponse.data.data.transactionId;
                        let payedAmount = currencySymbol + updateResponse.data.data.amount;
                        navigate(`/booking/success`,
                            {
                                state: {
                                    transactionId: transactionId,
                                    expertFName: specialistName,
                                    expertLName: specialistLastName,
                                    specialistfee: payedAmount,
                                    message: '',
                                }
                            });
                        setErrorMsg("");
                        const textarea = document.getElementById('call_scheduled_reason') as HTMLTextAreaElement | null;
                        if (textarea) {
                            textarea.value = '';
                        }

                        setTimeout(() => {
                            toggle(); // Close the modal
                            setSuccessMsg(""); // Clear success message
                        }, 50);

                        toggleClose();
                    }

                }

            } else {
                const response = await interviewSchedule({
                    interview_date: formattedDate,
                    interview_time: convertedTime,
                    interview_timezone: SelectedTimezone,
                    interview_id: bookingId,
                    status: interviewStatus,
                });
                if ("error" in response) {
                    console.error("Error logging in:", response.error);
                    if (typeof response.error === "string") {
                        setErrorMsg(response.error); // Assign the error message if it's already a string
                    } else {
                        const fetchError = response.error as FetchBaseQueryError; // Type assertion
                        if (
                            fetchError.data &&
                            typeof fetchError.data === "object" &&
                            "error" in fetchError.data &&
                            typeof fetchError.data.error === "string"
                        ) {
                            setErrorMsg(fetchError.data.error);
                        } else {
                            setErrorMsg("An error occurred"); // Handle cases where error property doesn't exist
                        }
                    }
                    setSuccessMsg("");
                } else {

                    let title = 'New Time Proposed';
                    let text = `Awaiting confirmation from user`;
                    Swal.fire({
                        title: `${title}`,
                        text: `${text}`,
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
                    setErrorMsg("");
                    const textarea = document.getElementById('call_scheduled_reason') as HTMLTextAreaElement | null;
                    if (textarea) {
                        textarea.value = '';
                    }

                    setTimeout(() => {
                        toggle(); // Close the modal
                        setSuccessMsg(""); // Clear success message
                    }, 50);

                    toggleClose();
                }
            }


        } catch (error) {
            console.error("Failed to fetch specialist list:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const ukTime = moment.tz('Europe/London');
    const handleJoinNow = async () => {
        const convertedTime = ukTime.format('HH:mm');
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
        const response = await interviewSchedule({
            interview_date: formattedDate,
            interview_time: convertedTime,
            interview_timezone: SelectedTimezone,
            interview_id: bookingId,
            status: interviewStatus,
        });
        if ("error" in response) {
            console.error("Error logging in:", response.error);
            if (typeof response.error === "string") {
                setErrorMsg(response.error); // Assign the error message if it's already a string
            } else {
                const fetchError = response.error as FetchBaseQueryError; // Type assertion
                if (
                    fetchError.data &&
                    typeof fetchError.data === "object" &&
                    "error" in fetchError.data &&
                    typeof fetchError.data.error === "string"
                ) {
                    setErrorMsg(fetchError.data.error);
                } else {
                    setErrorMsg("An error occurred"); // Handle cases where error property doesn't exist
                }
            }
            setSuccessMsg("");
        } else {

            let title = 'New Time Proposed';
            let text = `Awaiting confirmation from user`;
            Swal.fire({
                title: `${title}`,
                text: `${text}`,
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
            setErrorMsg("");
            const textarea = document.getElementById('call_scheduled_reason') as HTMLTextAreaElement | null;
            if (textarea) {
                textarea.value = '';
            }

            setTimeout(() => {
                toggle(); // Close the modal
                setSuccessMsg(""); // Clear success message
            }, 50);

            toggleClose();
        }
    };

    const cancelBookACall = () => {
        setShowTimeSlot('1 hour');
        changeTimeSlot('1 hour');
        toggleClose();
    }

    return (
        <>
            {
                isLoading ? (
                    <div className="page-loader" >
                        <div className="page-innerLoader">
                            <div className="spinner-border" role="status">
                                <img src={require("../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div >
                ) : ("")}
            <Modal
                isOpen={isOpen}
                toggle={toggleClose}
                className="sidebar-modal specialist-videomodal-page"
                fade={false}
            >
                <ModalBody>
                    <div className="chat-list-head d-md-none d-lg-none d-flex align-items-center justify-content-end">
                        <FontAwesomeIcon icon={faTimesCircle} onClick={toggleClose} />
                    </div>
                    <div className="specialist-videomodal">
                        <div className="row">
                            <div className="col-sm-12">
                                {from !== 'interview' && from !== 'Expert' && (
                                    <div className="bookcall-box">
                                        <h4 className="customHeading">
                                            BOOK A CALL WITH {specialistName}
                                        </h4>
                                        <p>A {showTimeSlot} call with {specialistName} will cost {specialistfee}. Please select your time and date below</p>
                                    </div>
                                )}
                                <div className="image-wrapper">
                                    <div className="imgbox">
                                        {specialistDp ? (
                                            <img style={{ borderRadius: '50%' }}
                                                src={specialistDp}
                                                className="img-fluid applicant-one"
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                src={require("../../../assets/images/profile/Default.jpg")}
                                                alt="Profile"
                                                className="img-fluid"
                                                style={{ borderRadius: '50%' }}
                                            />
                                        )}
                                    </div>
                                    <div className="imgbox">
                                        <img
                                            src={userData?.members_profile_picture ? userData.members_profile_picture : require("../../../assets/images/profile/Default.jpg")}
                                            alt="Profile"
                                            className="img-fluid"
                                            style={{ borderRadius: '50%' }}
                                        />
                                    </div>
                                </div>
                                <div className="date-picker-box">
                                    <HorizontalCalender
                                        onSelectDate={handleDateSelect}
                                        selected={selectedDate}
                                    />
                                </div>
                                <div>
                                    <button onClick={handleJoinNow} className={showScheduleNow ? "button-style ConfirmCall w-100 btn-dark" : "d-none"}>Schedule for Now</button>
                                </div>

                                <CustomTimePicker handleChange={handleTimeChange} selectedTime={selectedTime} selectedDate={callSheduleDate} timezoneTime={undefined} specialist_id={userId} changeTimeSlot={changeTimeSlotHere} from={from} isRearrange={isRearrange} timeSlot={timeSlot} />

                                <div className="error">{ErrorMsg}</div>
                                <div className="success">{SuccessMsg}</div>
                                {from !== 'interview' && from !== 'Expert' && (
                                    <div className="oneHourcall">
                                        <span>{showTimeSlot} Call Charge : {specialistfee}</span>
                                    </div>
                                )}
                                <Button
                                    theme="dark"
                                    onClick={() => handlePayment()}
                                    text={`${BtnText} ${specialistfee}`}
                                    className="ConfirmCall w-100"
                                    icon={true}
                                />
                                <div className="cancel">
                                    <a className="button-link" style={{ cursor: "pointer" }} onClick={cancelBookACall}>
                                        Cancel
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

