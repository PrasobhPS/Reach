import { Modal, ModalBody } from "reactstrap";
import { HorizontalCalender } from "../../../../components/Date/HorizontalCalender";
import { Timepicker } from "../../../../components/Timepicker/Timepicker";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useScheduleInterviewMutation, useInterviewBookedTimesMutation } from "../../../Cruz/Api/InterviewApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../../components/Button/Button";
import { getUserData } from "../../../../utils/Utils";
import { useSocket } from "../../../../contexts/SocketContext";

interface Props {
    showInterviewModal: boolean;
    setShowInterviewModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const baseUrl = process.env.REACT_APP_STORAGE_URL;

export const SetInterviewModal = ({ showInterviewModal, setShowInterviewModal }: Props) => {
    const userData = getUserData('userData');
    const { socket, privateChatMember, employeeDetails } = useSocket();
    const [SelectedTimezone, setSelectedTimezone] = useState<string>('Europe/London');
    const [selectedTime, setSelectedTime] = useState<string>();
    const [selectedDate, setSelectedDate] = useState<Date>(moment().toDate());
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [scheduleInterview] = useScheduleInterviewMutation();
    const [interviewBookedTimes] = useInterviewBookedTimesMutation();
    const [showScheduleNow, setShowScheduleNow] = useState<boolean>(true);

    const handleDateChange = async (date: Date) => {
        try {
            if (employeeDetails) {
                setIsLoading(true);
                setSelectedDate(date);
                setSelectedTime(undefined);
                const formattedDate = moment(date).format("YYYY-MM-DD");
                const response = await interviewBookedTimes({
                    interview_date: formattedDate,
                    job_id: employeeDetails.job_id,
                });

                if ("error" in response) {
                    throw new Error(JSON.stringify(response.error));
                }

                const data = response.data.data;
                const transformedTime = data.map(
                    (item: { interview_time: string }) =>
                        moment(item.interview_time, "HH:mm:ss").format("HH:mm")
                );

                setBookedTimes(transformedTime);
            }
        } catch (error) {
            console.error("Change date error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimezoneChange = (timezone: string) => {
        setSelectedTimezone(timezone);
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
    };

    const handleSubmit = async (now: string) => {
        try {
            if (employeeDetails) {

                setIsLoading(true);
                setErrorMsg('');
                setSuccessMsg('');
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
                let formattedTime = "";




                if (formattedTime === '') {

                    if (now === 'now') {
                        formattedTime = moment(ukTime.format('HH:mm'), "HH:mm").format("HH:mm");
                    } else if (selectedTime) {
                        formattedTime = moment(selectedTime, "HH:mm").format("HH:mm");
                    } else {
                        setErrorMsg('Please select time');
                        return;
                    }
                }

                const params = {
                    job_id: employeeDetails.job_id,
                    employee_id: employeeDetails.employee_id,
                    interview_time: formattedTime,
                    interview_date: formattedDate,
                    interview_timezone: SelectedTimezone,
                    status: 'P'
                };
                const response = await scheduleInterview(params);

                if ("error" in response) {
                    setSuccessMsg('');
                    setErrorMsg('Something went wrong. Cannot schedule interivew.');
                    throw new Error(JSON.stringify(response.error));
                } else {
                    if (socket?.connected) {
                        // update interview status
                        socket.emit('hasInterviewExist', {
                            job_id: employeeDetails.job_id,
                            employee_id: employeeDetails.employee_id
                        });

                        socket.emit('notifyInterview', {
                            date: selectedDate,
                            time: selectedTime,
                            receiver: privateChatMember,
                            interview_id: response.data.data.interview_id ?? null
                        });
                    }
                    setErrorMsg('');
                    setSuccessMsg('The interview has been scheduled successfully');
                    setTimeout(() => {
                        setShowInterviewModal(false);
                    }, 2000);
                }
            }
        } catch (error) {
            console.error("Schedule interview error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const ukTime = moment.tz('Europe/London');

    useEffect(() => {
        if (!showInterviewModal) {
            setErrorMsg('');
            setSuccessMsg('');
            setSelectedTime(undefined);
            setSelectedDate(moment().toDate());
        }
    }, [showInterviewModal]);

    const handleJoinNow = () => {
        setSelectedTime(ukTime.format('HH:mm'));
        handleSubmit('now');
    };

    useEffect(() => {
        if (moment(new Date(selectedDate)).isSame(moment().startOf('day'), 'day')) {
            // setSelectedTime(ukTime.format('HH:mm'));
            setShowScheduleNow(true);
        } else {
            setShowScheduleNow(false);
        }
    }, [selectedDate]);

    return (
        <div className="chat-modal">
            <Modal isOpen={showInterviewModal} className="sidebar-modal" fade={false}>
                <ModalBody>
                    <div className="specialist-videomodal">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="image-wrapper">
                                    <div className="imgbox">
                                        <img
                                            src={userData?.members_profile_picture ? userData.members_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                            alt="Profile"
                                            className="img-fluid"
                                            style={{ borderRadius: '50%' }}
                                        />
                                    </div>
                                    <div className="imgbox">
                                        <img
                                            src={privateChatMember?.member_profile_picture ? baseUrl + privateChatMember.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                            alt="Profile Image"
                                            className="img-fluid"
                                            style={{ borderRadius: '50%' }}
                                        />
                                    </div>
                                </div>
                                <div className="date-picker-box">
                                    <HorizontalCalender
                                        onSelectDate={handleDateChange}
                                        selected={selectedDate}
                                    />
                                </div>
                                <div>
                                    <button onClick={handleJoinNow} className={showScheduleNow ? "button-style ConfirmCall w-100 btn-dark" : "d-none"}>Schedule for Now</button>
                                </div>
                                <div className="time-picker-box">
                                    <Timepicker
                                        handleTimezoneChange={handleTimezoneChange}
                                        handleChange={handleTimeChange}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        bookedTimes={bookedTimes}
                                        timezoneTime={SelectedTimezone}
                                    />
                                    <div className="arrow-down">
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </div>
                                </div>
                                <div className="error">{errorMsg}</div>
                                <div className="success">{successMsg}</div>
                                <Button
                                    theme="dark"
                                    onClick={() => handleSubmit('')}
                                    text="Confirm Interview"
                                    className="ConfirmCall w-100"
                                    icon={true}
                                />
                                <div className="cancel cursor-pointer" onClick={() => setShowInterviewModal(false)}>
                                    <a className="button-link">Cancel</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default SetInterviewModal;