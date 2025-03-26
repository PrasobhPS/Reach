import React, { useEffect, useState, ChangeEvent } from "react";
import "../Components/Profile.scss";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { useSpecbookingsMutation, useMemberbookingsMutation, useAcceptStatusMutation, useCancelStatusMutation, useVideoCallDurationMutation } from "../MyBookingApiSlice";
import { getUserData } from "../../../utils/Utils";

import { UpcomingBooking } from "../UpcomingBooking";
import { History } from "../History";
import { BookingRequest } from "../BookingRequest";

import { BookingInterfaces } from "../../../types/BookingInterface";//BookingbuttonClasses.tsx
import { BookingbuttonInterfaces } from "../../../types/BookingbuttonInterfaces";
import moment from 'moment';
import { Timepicker } from "../../../components/Timepicker/Timepicker";
import { Modal, ModalBody } from "reactstrap";
import {
  useCallScheduleMutation, useBookSpecialistMutation, useSpecialistProfileMutation
} from "../../../features/Specialist/SpecialistApiSlice";
import { HorizontalCalender } from "../../../components/Date/HorizontalCalender";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";
import CancelBooking from "../Components/SingleBookingCard/CancelBooking";
import { MODAL_TYPES, useGlobalModalContext } from "../../../utils/GlobalModal";
import Swal from "sweetalert2";
import { useSocket } from "../../../contexts/SocketContext";
import { CustomTimePicker } from "../../../components/Timepicker/CustomTimePicker";
import { BookModal } from "./BookModal";
import AcceptBooking from "./SingleBookingCard/acceptBooking";
interface MyBookingsProps {
  tabActive?: string;
}
export function MyBookings({ tabActive }: MyBookingsProps) {
  const navigate = useNavigate();
  const userData = getUserData("userData");
  const [userImage, setUserImage] = useState("");
  const { setIsShowEnvelopeIcon } = useSocket();
  const [stripeVerified, setStripeVerified] = useState<boolean>(false);

  let currencySymbol = "GBP";
  let memberType = "";
  let memberdp = "";
  let memberid = "";

  let token = "";
  let is_specialist = "";
  let image: string;
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
      memberid = userData.Member_id;
      currencySymbol = userData.currency ? userData.currency : "GBP";
      memberdp = userData.members_profile_picture;//Call schedule
      token = userData.Token;
      is_specialist = userData.is_specialist;
      if (userData.members_profile_picture !== userImage) {
        image = userData.members_profile_picture;
        setUserImage(image);
      }
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };


  const [MyBookings] = useSpecbookingsMutation();

  const [MyBookingsSec] = useMemberbookingsMutation();


  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const [isLoading, setIsLoading] = useState(false);


  //const [details, setdetails] = useState<BookingInterfaces[]>([]);
  const [newBooking, setnewBooking] = useState<BookingInterfaces[]>([]);
  const [upcomingBooking, setupcomingBooking] = useState<BookingInterfaces[]>([]);
  const [bookingHistory, setbookingHistory] = useState<BookingInterfaces[]>([]);
  const [combinedDateTime, setCombinedDateTime] = useState<Date | null>(null);
  const [AcceptStatusupdation] = useAcceptStatusMutation();
  const [CancelStatusupdation] = useCancelStatusMutation();
  const [stepIndex, setStepIndex] = useState(0);
  //Call schedule
  const [modal, setModal] = useState(false);
  const today = moment().toDate(); // Convert Moment to Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>();
  const [SelectedTimezone, setSelectedTimezone] = useState<string>('Europe/London');
  const [ErrorMsg, setErrorMsg] = useState<string>("");
  const [SuccessMsg, setSuccessMsg] = useState<string>("");
  const [specialistDp, setImage] = useState<string | null>(null);
  const [specialistId, setSpecId] = useState<string>('');
  const [specialistfee, setSpecialistFee] = useState<number>(0);
  const [specialistName, setSpecialistName] = useState<string>('');
  const [specialistFName, setSpecialistFName] = useState<string>('');
  const [specialistLName, setSpecialistLName] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<'1 hour' | '30 min'>('1 hour');
  const [userMemId, setUserMemId] = useState<string>('');
  const [bookingId, setbookingId] = useState<string>('');
  const [singlecard, SinglecardDetail] = useState<BookingInterfaces[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalOpen1, setModalOpen1] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [bookAgain, setBookAgain] = useState<boolean>(false);
  const [activeTabSpec, setActiveTabSpec] = useState<string>(tabActive || "MyBookings2");
  const [activeTab, setActiveTab] = useState<string>("MyProfile");
  const [from, setFrom] = useState<string>('');
  const [isRearrange, setIsRearrange] = useState<boolean>(false);

  const [videoCallDuration] = useVideoCallDurationMutation();

  // Cancel Booking

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const toggleModal1 = () => {
    setModalOpen1(!modalOpen1);
  }
  const handleAfterCancel = () => {
    // This function will be called after the API call in CancelBooking
    let title = 'Booking Cancelled !';
    let subtitle = 'Booking cancelled successfully';
    Swal.fire({
      title: title,
      text: subtitle,
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
    fetchMyBookingsApi(activeTabSpec, is_specialist);
    // Add any other effects you want to apply here, e.g., refreshing data
  };

  const handleAfterAccept = () => {
    let title = 'Booking Accepted !';
    let subtitle = 'Booking accepted successfully';
    Swal.fire({
      title: title,
      text: subtitle,
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
    fetchMyBookingsApi(activeTabSpec, is_specialist);
    // Add any other effects you want to apply here, e.g., refreshing data
  };

  // const changeTimeSlot = (timeslot: any) => {
  //   console.log('timeslot-----', timeslot);
  //   if (specialistCallRate) {
  //     let timeAmount = parseInt(specialistCallRate['one']);
  //     if (timeslot === '30min') {
  //       timeAmount = parseInt(specialistCallRate['half']);
  //     }


  //     setSpecialistfee(timeAmount);
  //   }
  //   setTimeSlot(timeslot);
  // }

  const handleTabClick = (tabName: string) => {
    setActiveTabSpec(tabName);
    setActiveTab(tabName);
    fetchMyBookingsApi(tabName, is_specialist);



  };
  //Call schedule
  const toggle = () => {
    setModal(!modal);

    // Reset state variables to their initial values when modal is closed
    setSelectedDate(today);
    setSelectedTime(null);
    setErrorMsg("");
    setSuccessMsg("");
    if (today) {
      handleDateSelect(today);
    }

    fetchMyBookingsApi(activeTabSpec, is_specialist);
  };
  //{ is_specialist === 'Y' ? (fetchMyBookingsApi()) : fetchMyBookingsApiSec() }
  const { userId } = useParams<{ userId: string }>();




  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };
  const [callSchedule] = useCallScheduleMutation();
  const [bookedTimes, setTimes] = useState<string[]>([]);
  const [BookSpecialist] = useBookSpecialistMutation();
  const [SpecialistProfile] = useSpecialistProfileMutation();
  const { showModal } = useGlobalModalContext();
  const { hideModal, store } = useGlobalModalContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  //Call schedule
  //Call schedule
  const handleDateSelectRearrange = async (date: Date, SpecialistID: any) => {
    setSelectedDate(date);
    setIsLoading(true);




    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");



      let user_mem_id;
      if (SpecialistID !== undefined) {
        user_mem_id = SpecialistID;
      } else {
        const member_id = memberid; // Replace with actual member ID if available
        user_mem_id = member_id;
      }


      const response = await callSchedule({
        specialist_id: user_mem_id,
        call_scheduled_date: formattedDate,
        timeSlot: timeSlot
      });
      if ("error" in response) {
        throw new Error("Failed to schedule call");
      }
      const data = response.data.data; // Assuming response.data contains the response data
      const transformedTime = data.map(
        (item: { call_scheduled_time: string }) =>
          moment(item.call_scheduled_time, "HH:mm:ss").format("hh:mm A")
      );
      setTimes(transformedTime);
    } catch (error) {
      console.error("Failed to schedule call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setIsLoading(true);



    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");



      setUserMemId(activeTabSpec === 'MyBookings1' || activeTabSpec === '' ? memberid : specialistId);


      const response = await callSchedule({
        specialist_id: userMemId,
        call_scheduled_date: formattedDate,
        timeSlot: timeSlot
      });
      if ("error" in response) {
        throw new Error("Failed to schedule call");
      }
      const data = response.data.data; // Assuming response.data contains the response data
      const transformedTime = data.map(
        (item: { call_scheduled_time: string }) =>
          moment(item.call_scheduled_time, "HH:mm:ss").format("hh:mm A")
      );
      setTimes(transformedTime);
    } catch (error) {
      console.error("Failed to schedule call:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //Call schedule


  const handleSubmit = async (stripeToken: any) => {
    if (stripeToken === 'Error') {
      return false;
    }
    setIsLoading(true);

    try {
      hideModal();
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      let convertedTime = "";
      if (selectedTime) {
        convertedTime = moment(selectedTime, "hh:mm A").format("hh:mm A");
      } else {
        console.log("selectedTime is null or undefined");
      }

      // setUserMemId(activeTabSpec === 'MyBookings2' || activeTabSpec === '' ? memberid : specialistId);



      let user_mem_id;
      let currentBookingId = bookingId;
      if (bookAgain) {
        currentBookingId = '';
      }
      if (specialistId !== undefined) {
        user_mem_id = specialistId;
      } else {
        const member_id = memberid; // Replace with actual member ID if available
        user_mem_id = member_id;
      }


      const response = await BookSpecialist({
        specialist_id: user_mem_id,
        call_scheduled_date: formattedDate,
        call_scheduled_time: convertedTime,
        call_scheduled_timezone: SelectedTimezone, booking_id: currentBookingId,
        stripeToken: stripeToken,
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
        setButtonClicked(true);

        setSuccessMsg("");
      } else {
        let title = 'Rearranged !';
        let subtitle = 'Booking time arranged';
        if (bookAgain) {
          title = 'Payment Done!';
          subtitle = 'You have booked with the specialist for a call.';
        }
        Swal.fire({
          title: title,
          text: subtitle,
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
        setBookAgain(false);
        setTimeout(() => {
          toggle(); // Close the modal
          setSuccessMsg(""); // Clear success message
        }, 50);
      }
    } catch (error) {
      console.error("Failed to fetch specialist list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    setIsLoading(true);
    try {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      let convertedTime = "";
      if (selectedTime) {
        convertedTime = moment(selectedTime, "hh:mm A").format("hh:mm A");

        showModal(MODAL_TYPES.PAYMENT_MODAL, {
          onCloseCallback: handleSubmit,
          handleSubmit: (stripeToken: any) => {
            handleSubmit(stripeToken);
          }
        });
      } else {
        setErrorMsg("Please select a Time before booking");
      }

    } catch (error) {
      console.error("Failed to fetch specialist list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitManage = async () => {

    if (bookAgain) {
      handlePayment();
    } else {
      handleSubmit('');
    }

  }
  //Bookings
  //const handlebuttonSub = async (event: React.MouseEvent<HTMLButtonElement>, stepIndex: any, memImage: string,callDate: Date,callTime:string,specialist_id:any) => {
  const handlebuttonSub = async (event: React.MouseEvent<HTMLButtonElement>, data: any) => {
    const buttonText = event.currentTarget.innerText;
    setIsLoading(true);
    try {
      if (buttonText.toLowerCase() === "accept") {
        if (!stripeVerified && activeTabSpec === 'MyBookings1') {
          showModal(MODAL_TYPES.CONFIRM_MODAL, {
            title: "CONNECT STRIPE",
            details: "Please connect your stripe account from payment tab",

            confirmBtn: "OK",
            handleSubmit: () => {
              toggleModal1();
              SinglecardDetail(data);
              hideModal();
            },

          });
        } else {
          toggleModal1();
          SinglecardDetail(data);
        }


      }

      if (buttonText.toLowerCase() === "cancel") {
        toggleModal();
        SinglecardDetail(data);

        // { (activeTabSpec === 'MyBookings1' && is_specialist === 'Y')  ? (fetchMyBookingsApi()) : fetchMyBookingsApiSec() }
      }//Propose New Time

      if (buttonText.toLowerCase() === "propose new time") {
        setbookingId(data.id);
        toggle();
        setImage(data.member_image ? baseUrl + data.member_image : "");
        handleDateSelectRearrange(today, data.specialist_id);
        setTimeSlot(data.timeSlot)
        setIsModalOpen(true);
        setSpecId(data.specialist_id);
        setFrom('Expert');
        setIsRearrange(true);
      }

      if (buttonText.toLowerCase() == "book again") {
        setBookAgain(true);
        setSpecId(data.specialist_id);
        setSpecialistName(data.firstName + ' ' + data.lastName);
        setSpecialistFName(data.firstName);
        setSpecialistLName(data.lastName);
        setSpecialistFee(data.fee);
        setIsModalOpen(true);
        setImage(data.member_image ? baseUrl + data.member_image : "");

        handleDateSelect(today);
        setIsRearrange(false);
      }

      if (buttonText.toLowerCase() === "rearrange") {
        console.log('timeslot---', data.timeSlot);
        setBookAgain(false);
        setSpecId(data.specialist_id);
        setSpecialistName(data.firstName + ' ' + data.lastName);
        setSpecialistFName(data.firstName);
        setSpecialistLName(data.lastName);
        setSpecialistFee(0);
        setbookingId(data.id);
        setTimeSlot(data.timeSlot);
        setIsRearrange(true);
        //toggle();
        setModal(!modal);
        setSelectedDate(today);
        setSelectedTime(null);
        setErrorMsg("");
        setSuccessMsg("");
        if (activeTabSpec === 'MyBookings1') {
          setFrom('Expert');
        } else {
          setFrom('');
        }
        setIsModalOpen(true);

        setImage(data.member_image ? baseUrl + data.member_image : "");
        // setSelectedDate(callDate);
        // setSelectedTime(callTime);
        handleDateSelectRearrange(data.callDate, data.specialist_id);


      }
      if (buttonText.toLowerCase() === "join call" && data.call_status !== 'P') {

        const passData = {
          meeting_id: data.meeting_link,
        };

        const response = await videoCallDuration(passData);
        if ("data" in response) {

          const callDatecheck = new Date(data.scheduleDate + ' ' + data.scheduledTime);
          const callEndTimecheck = new Date(callDatecheck.getTime() + response.data.duration * 60000);
          const nowcheck = convertToUKTime(new Date());
          console.log('nowcheck---', nowcheck);
          console.log('callEndTimecheck----', callEndTimecheck);
          // Check if current time is less than call end time
          if (nowcheck < callEndTimecheck) {
            const postParams = {
              meeting_id: data.meeting_link,
              subject: 'Reach Call',
              call_date: data.scheduleDate + ' ' + data.scheduledTime,
              duration: response.data.duration,
              type: 'call',
              is_expert: activeTabSpec === 'MyBookings1' ? '1' : '0',
            };
            const queryString = new URLSearchParams(postParams).toString();
            window.open(`/video-call?${queryString}`, '_blank');
          }

        }



      }

      fetchMyBookingsApi(activeTabSpec, is_specialist);

    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsLoading(false);
    }

  }
  //Bookings
  function convertToUKTime(date: Date): Date {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  }
  const fetchMyBookingsApi = async (activeTabSpec: string, is_specialist: string) => {
    setIsLoading(true);
    try {
      let response;
      if (activeTabSpec === 'MyBookings1' && is_specialist === 'Y') {
        response = await MyBookings(token); // Adjust the function call as needed
      } else {
        response = await MyBookingsSec(token); // Adjust the function call as needed
      }


      if ("error" in response) {
        throw new Error("Failed to fetch booking details");
      }
      const data = await response.data.data;
      const stripe_verified = await response.data.stripe_verified;
      if (stripe_verified) {
        setStripeVerified(stripe_verified);
      }

      const formatTime = (timeString: string, duration: number) => {
        const [startHour, startMinute] = timeString.split(':');
        let startHourInt = parseInt(startHour);
        let startMinuteInt = parseInt(startMinute);

        // Start time in 24-hour format
        const formattedStartTime = `${startHourInt.toString().padStart(2, '0')}:${startMinuteInt.toString().padStart(2, '0')} `;

        // Calculate end time based on duration in minutes
        let totalMinutes = startHourInt * 60 + startMinuteInt + duration;
        let endHourInt = Math.floor(totalMinutes / 60) % 24; // Ensure it wraps around 24 hours
        let endMinuteInt = totalMinutes % 60;

        const formattedEndTime = `${endHourInt.toString().padStart(2, '0')}:${endMinuteInt.toString().padStart(2, '0')} `;

        return `${formattedStartTime} - ${formattedEndTime} `;
      };




      const defaultLocale = 'en-US';
      const formatDate = (dateObject: Date, days: string): string => {
        const options: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        };

        if (days === "days") {
          return dateObject.toLocaleDateString(defaultLocale, { day: options.day });
        } else {
          return dateObject.toLocaleDateString(defaultLocale, { month: options.month });
        }
      };

      const formatScheduleTime = (timeString: string) => {
        const [startHour, startMinute] = timeString.split(":");
        const startHourInt = parseInt(startHour);
        const period = startHourInt >= 12 ? "PM" : "AM";
        const formattedStartHour = startHourInt % 12 || 12;

        return `${formattedStartHour}:${startMinute} ${period} `;
      };

      const getFullFromDate = (dateObject: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "long",
          year: "numeric",
        };
        // Extract the formatted parts
        const day = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(
          dateObject
        );
        const month = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(dateObject);
        const year = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
        }).format(dateObject);

        // Construct the desired format
        return `${day} ${month} ${year} `;
      };

      const newBookingsItems: BookingInterfaces[] = [];
      const upcomingBookingsItems: BookingInterfaces[] = [];
      const historyBookingsItems: BookingInterfaces[] = [];

      data.forEach((item: {
        id: number;
        specialist_id: number;
        call_fee: number;
        call_scheduled_date: Date;
        timeSlot: string;
        uk_scheduled_time: string;
        day: string;
        month: string;
        members_fname: string;
        members_lname: string;
        members_profile_picture: string;
        call_status: string;
        btnText: string;
        bookingTab: string;
        call_scheduled_reason: string;
        members_country: string;
        meeting_link: string;
        member_rearrange: string;
        currency: "USD" | "GBP" | "EUR";
        duration: number;

      }) => {
        const dateObject = new Date(item.call_scheduled_date);
        // Combine date and time      

        const editdate = moment(`${item.call_scheduled_date}T${item.uk_scheduled_time}`);
        const formattedDate = editdate.format('ddd MMM DD YYYY HH:mm:ss');
        const dateObjects = new Date(formattedDate);
        const nowTime = moment(convertToUKTime(new Date())); // Ensure it's a moment object
        const minuteDifference = editdate.diff(nowTime, 'minute');
        const hourDifference = editdate.diff(nowTime, 'hours');
        let callStatus = item.call_status;
        let showCall = false;
        let showCancel = false;
        let showRearrange = false;
        if (((activeTabSpec === 'MyBookings2' && (item.call_status === 'A' || item.call_status === 'P' || item.call_status === 'R' || item.call_status === 'S')) || (is_specialist === 'Y' && activeTabSpec !== 'MyBookings2' && (item.call_status === 'P' || item.call_status === 'R'))) && minuteDifference > 0) {
          showCancel = true;
        }
        let callduration = -60;
        let timeSlotselected = '30 min'
        if (item.timeSlot === '1hr' || item.timeSlot === '1 hour') {
          callduration = callduration;
          timeSlotselected = '1 hour';
        } else {
          callduration = -30;
          timeSlotselected = '30 min';
        }

        if (item.call_status === 'A' && (minuteDifference < 1 && minuteDifference > callduration)) {
          showCall = true;
        }
        if (((hourDifference > 48 && activeTabSpec === 'MyBookings2' && item.call_status === 'A' && String(item.member_rearrange) !== '1') || (item.call_status === 'R') || (item.call_status === 'S') || (is_specialist === 'Y' && activeTabSpec !== 'MyBookings2')) && minuteDifference > 0) {
          showRearrange = true;
        }
        console.log('minuteDifference--', minuteDifference);
        console.log('callduration---', callduration);
        if (minuteDifference < 0 && (item.call_status !== 'H' && item.call_status !== 'A') || (minuteDifference < callduration && item.call_status === 'A')) {
          callStatus = 'H';
        }
        const formattedItem: BookingInterfaces = {
          id: item.id,
          specialist_id: item.specialist_id,
          fee: item.call_fee,
          callDate: dateObject,
          day: formatDate(dateObject, "days"),
          month: formatDate(dateObject, "month"),
          time: formatTime(item.uk_scheduled_time, item.duration),
          firstName: item.members_fname,
          lastName: item.members_lname,
          member_image: item.members_profile_picture,
          call_status: item.call_status,
          btnText: "",
          btnClassname: "",
          btnTheme: "",
          is_specialistval: "",
          bookingTab: "",
          scheduledTime: formatScheduleTime(item.uk_scheduled_time),
          scheduleDate: getFullFromDate(dateObject),
          call_scheduled_reason: item.call_scheduled_reason,
          members_country: item.members_country,
          meeting_link: item.meeting_link,
          showCancel: showCancel,
          showCall: showCall,
          showRearrange: showRearrange,
          hourDifference: hourDifference,
          timeSlot: timeSlotselected,
          currency: currencySymbols[item.currency],
          duration: item.duration,

        };
        if (callStatus === "P" || callStatus === "R") {
          newBookingsItems.push(formattedItem);
          if (activeTabSpec === 'MyBookings2') {
            upcomingBookingsItems.push(formattedItem);
          }
        } else if (callStatus === "A") {
          upcomingBookingsItems.push(formattedItem);
        } else if (callStatus === "H" || callStatus === "S") {
          historyBookingsItems.push(formattedItem);
        }
        return formattedItem;
      });


      setnewBooking(newBookingsItems);
      setupcomingBooking(upcomingBookingsItems);
      setbookingHistory(historyBookingsItems);

      //let countcons = newBookingsItems.length;







    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    fetchMyBookingsApi(activeTabSpec, is_specialist);
    // fetchMyBookingsApi('MyBookings1',is_specialist,token); 



  }, []);

  //is_specialist="Y";
  const BookingreqButtonDetails = {
    btnText: "Accept",
    btnClassname: "pending-status",
    btnTheme: "dark" as "light" | "dark" | "grey",
    btnSmallText: "Propose New Time",
    is_specialistval: is_specialist,
    bookingTab: activeTabSpec

  };
  const UpcomingButtonDetails = {
    btnText: "Join Call",
    btnClassname: "",
    btnTheme: "light" as "light" | "dark",
    btnSmallText: "Cancel",
    is_specialistval: is_specialist,
    bookingTab: activeTabSpec
  };

  const HistoryButtonDetails = {
    btnText: "Book Again",
    btnClassname: "history-status",
    btnTheme: "light" as "light" | "dark",
    btnSmallText: "Cancel",
    is_specialistval: is_specialist,
    bookingTab: activeTabSpec
  };
  const changeTimeSlot = (timeslot: any) => {
    //setTimeSlot(timeslot);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchMyBookingsApi(activeTabSpec, is_specialist);

  };
  // const haveSpecClass = haveSpec ? '' : 'd-none';
  return (
    <div className="mybooking-tabs" id="mybooking">
      {isLoading ? (
        <div className="page-loader">
          <div className="page-innerLoader">
            <div className="spinner-border" role="status">
              <img src={require("../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      ) : ("")}
      {is_specialist === "Y" ? (
        <div className="sub-childtab">
          <div className="tab-menu">
            <ul className="tab-menu-ul">
              <li className="tab-menu-item">
                <a
                  className={activeTabSpec === "MyBookings2" ? "active" : ""}
                  onClick={() => handleTabClick("MyBookings2")}
                >
                  My Bookings
                </a>
              </li>

              <li className="tab-menu-item">
                <a
                  className={activeTabSpec === "MyBookings1" ? "active" : ""}
                  onClick={() => handleTabClick("MyBookings1")}>
                  Expert Bookings
                </a>
              </li>


            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
      {is_specialist === "Y" && activeTabSpec === "MyBookings1" ? (
        <BookingRequest
          newBookingData={newBooking}
          BookingreqButtonDetails={BookingreqButtonDetails}
          handleSub={handlebuttonSub}
        />
      ) : (
        ""
      )}

      <UpcomingBooking
        upcomingBookingData={upcomingBooking}
        upcomingButtonDetails={UpcomingButtonDetails}
        handleSub={handlebuttonSub}
      />
      <History
        bookingHistoryData={bookingHistory}
        HistoryButtonDetails={HistoryButtonDetails}
        handleSub={handlebuttonSub}
      />

      {isModalOpen && (
        <BookModal isOpen={isModalOpen} toggleClose={handleCloseModal} userId={specialistId} specialistName={specialistFName} specialistLastName={specialistFName} timeSlot={timeSlot} specialistDp={specialistDp} changeTimeSlot={changeTimeSlot} reason={''} bookingId={bookingId} from={from} isRearrange={isRearrange} specialistFee={specialistfee} />
      )}

      {singlecard && (
        <>
          <AcceptBooking
            isOpen={modalOpen1}
            toggle={toggleModal1}
            singlecard={singlecard}
            userImage={userImage}
            afterAccept={handleAfterAccept}
          />

          <CancelBooking
            isOpen={modalOpen}
            toggle={toggleModal}
            singlecard={singlecard}
            userImage={userImage}
            afterCancel={handleAfterCancel}
          />
        </>
      )}
    </div>
  );
}

