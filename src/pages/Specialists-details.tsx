import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import { VideoCard } from "../components/VideoCard/VideoCard";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import moment from "moment";
import { HorizontalCalender } from "../components/Date/HorizontalCalender";
import { CustomTimePicker } from "../components/Timepicker/CustomTimePicker";
import "../assets/scss/specialists-detail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
  useSpecialistProfileMutation,
  useSpecialistVideosMutation,
  useCallScheduleWithSpecialistMutation,
  useGetSpecialistRatingQuery,
} from "../features/Specialist/SpecialistApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserData } from "../utils/Utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";
import { MODAL_TYPES, useGlobalModalContext } from "../utils/GlobalModal";
import CustomInput from "../components/CustomInput/CustomInput";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import Swal from "sweetalert2";
import { useMembershipFeeQuery } from "../features/Login/authApiSlice";
import { BookModal } from "../features/Profile/Components/BookModal";
import StarRating from "./StarRating";

interface Details {
  id: number;
  members_fname: string;
  members_lname: string;
  members_employment: string;
  members_biography: string | TrustedHTML;
  latest_video: string;
  // Add other properties here as needed
}
interface ExpertDetails {
  expert_call_title: string;
  expert_call_description: string;
}
interface VideoData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  videos: number | "";
  location: string | "";
  videoUrl: string | "";
}
interface ScheduledDetails {
  call_scheduled_date: Date;
  call_scheduled_time: string;
}
interface CallDetails {
  memberName: string;
  Specialist: string | undefined;
  Details: ScheduledDetails[];
}
interface RatingData {
  member_profile_picture: string;
  member_name: string;
  member_id: number;
  rating: number;
  review: string;
  date: string;
}

const SpecialistsDetails = () => {
  const today = moment().toDate(); // Convert Moment to Date
  const [callSheduleDate, setCallScheduleDate] = useState<Date | null>(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [modal, setModal] = useState(false);
  const [reason, setReason] = useState('');
  const [specialistName, setSpecialistName] = useState<string>('');
  const [refetchCalls, setRefetchCalls] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const userId = location.state;
  const baseUrl = process.env.REACT_APP_STORAGE_URL;

  const { data: ratingData, isLoading: ratingLoading, isSuccess: ratingSuccess, refetch } = useGetSpecialistRatingQuery({ userId });
  const [ratingDetails, setRatingDetails] = useState<RatingData[] | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  useEffect(() => {
    if (ratingSuccess && ratingData?.data) {
      const transformedData: RatingData[] = ratingData.data.map((item: any) => ({
        member_profile_picture: item.member?.members_profile_picture || "", // Default to empty string if null
        member_id: item.member_id,
        member_name: item.member.members_fname + ' ' + item.member.members_lname,
        rating: item.rating,
        review: item.review,
        date: item.date,
      }));
      setRatingDetails(transformedData);
      setRatingCount(transformedData.length);
      setAverageRating(ratingData.averageRating);
    }
  }, [ratingData, ratingSuccess]);

  useEffect(() => {
    refetch();
    if (window.location.href.includes('specialists-details')) {
      document.body.classList.add('specialists-details-class');
    } else {
      document.body.classList.remove('specialists-details-class');
    }
    return () => {
      document.body.classList.remove('specialists-details-class');
    };
  }, []);
  const toggle = () => {
    setModal(!modal);
    // Reset state variables to their initial values when modal is closed
    setSelectedDate(today);
    setSelectedTime(null);
    setErrorMsg("");
    setSuccessMsg("");

  };
  const { hideModal, store } = useGlobalModalContext();
  const { modalProps } = store || {};
  const handleModalToggle = () => {
    hideModal();
  };
  const [modal2Open, setModal2Open] = useState(false);
  const toggleModal2 = () => {
    setModal2Open(!modal2Open);
  };
  const chapters = [
    { title: "Introduction", time: 10, active: false },
    { title: "Navigation Systems", time: 21, active: true },
    { title: "Modern Technology", time: 27, active: false },
    { title: "Installation", time: 32, active: false },
    { title: "Support", time: 38, active: false },
  ];
  const methods = useForm();

  const userData = getUserData("userData");
  let token = "";
  let memberdp = "";
  let memberType = "";
  let memberName = "";
  let currencySymbol = "GBP";
  try {
    if (userData !== null) {
      token = userData.Token;
      memberdp = userData.members_profile_picture;
      memberType = userData.Member_type;
      memberName = userData.Member_fullname;
      currencySymbol = userData.currency ? userData.currency : "GBP";
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };



  // useParams hook to get parameters from the URL
  //const { userId } = useParams<{ userId: string }>();


  const [specialistDetails, setSpecialistDetails] = useState<Details | null>(
    null
  );
  const [expertDetails, setExpertDetails] = useState<ExpertDetails | null>(
    null
  );
  const [vsource, setVsource] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [thumbVideo, setThumbVideo] = useState<string | null>(null);
  const [specialistCallRate, setSpecialistCallRate] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [specialistDp, setImage] = useState<string | null>(null);
  const [specialistRating, setSpecialistRating] = useState<number>(0);

  const [SpecialistProfile] = useSpecialistProfileMutation();

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const fetchSpecialistProfile = async () => {
    setIsLoading(true);
    try {
      const response = await SpecialistProfile({ id: userId });
      if ("error" in response) {
        throw new Error("Failed to fetch specialist list");
      }
      const data = await response.data.data;
      setSpecialistName(data?.members_fname);
      setSpecialistCallRate(data.specialist_call_rates);
      setSpecialistDetails(data as Details);
      setExpertDetails(data as ExpertDetails);
      if (response.data.data.latest_video) {
        setVideo(
          `${response.data.filePath}/${response.data.data.latest_video}`
        );
      }
      if (response.data.data.thumb_image) {
        setThumbVideo(
          `${response.data.filePath}/${response.data.data.thumb_image}`
        );
      }
      if (response.data.data.members_profile_picture) {
        setImage(`${response.data.filePath}/${response.data.data.members_profile_picture}`);
      } else {
        setImage('');
      }

    } catch (error) {
      console.error("Failed to fetch specialist list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [videodatas, setVideodatas] = useState<VideoData[]>([]);
  const [SpecialistVideo] = useSpecialistVideosMutation();
  const fetchSpecialistVideo = async () => {
    setIsLoading(true);
    try {
      const response = await SpecialistVideo({ id: userId });
      if ("error" in response) {
        throw new Error("Failed to fetch specialist list");
      }
      const data = await response.data.data;
      const transformedData = data.map(
        (item: {
          video_id: number;
          video_thumb: string;
          video_title: string;
          video_sub_title: string;
          video_file: string;
        }) => ({
          id: item.video_id,
          image: `${response.data.filePath}/${item.video_thumb}`,
          title: item.video_title,
          subtitle: item.video_sub_title,
          videos: "",
          location: "",
          videoUrl: `${response.data.filePath}/${item.video_file}`,
        })
      );
      setVideodatas(transformedData);
    } catch (error) {
      console.error("Failed to fetch specialist list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const videodata = {
    id: 1,
    image:
      "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg",
    title: "My Title",
    subtitle: "My Subtitle",
    videos: 1,
    location: "My Location",
    videoUrl: "",
  };

  const [bookedTimes, setTimes] = useState<string[]>([]);



  const [selectedTime, setSelectedTime] = useState<string | null>();
  const [SelectedTimezone, setSelectedTimezone] = useState<string>('Europe/London');

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };

  const [callScheduledWithSpecialist] = useCallScheduleWithSpecialistMutation();
  const [callDetails, setCallDetails] = useState<CallDetails[]>([]);


  const fetchSpecialistCallList = async () => {
    setIsLoading(true);
    try {
      const response = await callScheduledWithSpecialist({ specialist_id: userId });
      if ("error" in response) {
        throw new Error("Failed to fetch specialist list");
      }
      const data = await response.data.data;

      const managedData: CallDetails = {
        memberName: memberName,
        Specialist: specialistName,
        Details: []
      };

      // Map data to extract call date and time into the details array
      const details: ScheduledDetails[] = data.map((item: ScheduledDetails) => ({
        call_scheduled_date: item.call_scheduled_date,
        call_scheduled_time: item.call_scheduled_time,
      }));

      // Add details array to managedData
      managedData.Details = details;

      setCallDetails([managedData]);

    } catch (error) {
      console.error("Failed to fetch specialist list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSpecialistCallList();
    fetchSpecialistProfile();
    fetchSpecialistVideo();
  }, []);

  // Function to handle video card click
  const handleVideoCardClick = (videoSource: string | null) => {
    setVsource(videoSource);
  };

  const navigate = useNavigate();
  const [ErrorMsg, setErrorMsg] = useState("");
  const [SuccessMsg, setSuccessMsg] = useState("");



  const handleBookCall = () => {
    if (memberType != "M") {
      memberModal();
    }
    else {
      setIsModalOpen(true);
      toggle();
    }

  }
  const handleCloseModal = () => {
    setTimeSlot('1 hour');
    setIsModalOpen(false); // Close modal when needed
    fetchSpecialistCallList();

  };
  const handleChange = (event: { target: { value: any; }; }) => {
    setReason(event.target.value);
  };
  const [specialistfee, setSpecialistfee] = useState<number>(0);
  const [timeSlot, setTimeSlot] = useState<'1 hour' | '30 min'>('1 hour');
  useEffect(() => {
    if (specialistCallRate && specialistCallRate['one_' + currencySymbol]) {
      setSpecialistfee(parseFloat(specialistCallRate['one_' + currencySymbol]));
    }
  }, [specialistCallRate])
  function changeTimeSlot(value: any): void {
    // throw new Error("Function not implemented.");
  }


  // star rating
  const [rating, setRating] = useState<number>(0);
  const tooltipArray = [
    "Terrible",
    "Terrible+",
    "Bad",
    "Bad+",
    "Average",
    "Average+",
    "Great",
    "Great+",
    "Awesome",
    "Awesome+"
  ];
  const handleRating = (rate: number) => {
    //console.log("Rating selected:", rate);
  };

  const [showLessList, setShowLessList] = useState<{ [key: number]: boolean }>(
    (ratingDetails ?? []).reduce((acc, _, index) => {
      acc[index] = false; // Default each review to "Show Less" (i.e., truncated)
      return acc;
    }, {} as { [key: number]: boolean })
  );

  const changeShow = (index: number) => {
    setShowLessList((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));

  };
  return (
    <div className="specialists-page">
      <div className="specialists-video-detail">
        <div className="container-fluid">
          {isLoading ? (
            <div className="page-loader">
              <div className="page-innerLoader">
                <div className="spinner-border" role="status">
                  <img src={require("../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
          ) : ("")}
          <div className="row">
            <div className="page-path">
              <div className="parent-direction">
                <label><a style={{ cursor: "pointer" }} onClick={() => navigate(`/experts`)
                }>Experts</a></label>
              </div>
              <span className="direction-arrow">
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
              <div className="child-direction">

                <label>
                  <a style={{ cursor: "pointer" }} onClick={() => navigate(`/publicprofile`,
                    {
                      state: userId,
                    })}>
                    {specialistDetails?.members_fname}{" "}
                    {specialistDetails?.members_lname}
                  </a>
                </label>

              </div>
            </div>
            <div className="col-lg-9 col-md-8  col-12">
              <div className="specialist-right-nameblock">
                <Heading tag="h2">
                  <a style={{ cursor: "pointer" }} onClick={() => navigate(`/publicprofile`,
                    {
                      state: userId,
                    })}>
                    {specialistDetails?.members_fname} {" "}
                    {specialistDetails?.members_lname}
                  </a>
                </Heading>
                <div className="rating d-md-none mb-2">
                  {/* <StarRating
                    onClick={handleRating}
                    size={20}
                    transition
                    allowFraction
                    showTooltip
                    expertRating={averageRating}
                    tooltipArray={tooltipArray}
                  /> */}
                  {averageRating > 0 && (


                    <div className="rating-profile d-flex align-items-center">
                      <div className="rating-count">
                        {/* <span>{averageRating}</span> */}
                      </div>
                      <StarRating
                        onClick={handleRating}
                        size={20}
                        transition
                        allowFraction
                        showTooltip
                        expertRating={averageRating}
                        tooltipArray={tooltipArray}
                      />
                      <div className="outoff mx-2">
                        <span className="text-white">({ratingCount})</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="designation">
                  {specialistDetails?.members_employment}
                </p>
              </div>

              {vsource ? (
                <VideoPlayer
                  videoId="specialist-video"
                  chapters={chapters}
                  source={vsource}
                  autoPlay={true}
                />
              ) : (
                <div className='img-box'>
                  {thumbVideo ? (
                    <img src={thumbVideo} className='img-fluid' />
                  ) : (
                    <img src={require("../assets/images/specialists/No-Thumbnail.png")} alt="" className="img-fluid" />
                  )}
                  {video && (
                    <span className='playbtn' onClick={() =>
                      handleVideoCardClick(video)}>
                      <img src={require("../assets/images/specialists/PlayButton.png")} />
                    </span>
                  )}

                </div>
              )}
            </div>
            <div className="col-lg-3 col-md-4 col-12">
              <div className="specialists-right-block pb-5">
                <Heading tag="h2" className="mb-0">
                  <a style={{ cursor: "pointer" }} onClick={() => navigate(`/publicprofile`,
                    {
                      state: userId,
                    })}>
                    {specialistDetails?.members_fname} <br />{" "}
                    {specialistDetails?.members_lname}
                  </a>
                </Heading>
                <div className="rating d-sm-none d-md-block">
                  {averageRating > 0 && (


                    <div className="rating-profile">
                      <div className="rating-count">
                        {/* <span>{averageRating}</span> */}
                      </div>
                      <StarRating
                        onClick={handleRating}
                        size={20}
                        transition
                        allowFraction
                        showTooltip
                        expertRating={averageRating}
                        tooltipArray={tooltipArray}
                      />
                      <div className="outoff">
                        <span>({ratingCount})</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="designation">
                  {specialistDetails?.members_employment}
                </p>

                <div className="biography-content price-detailsvalue">
                  <Heading tag="h6" className="underlineBio border-0" >Biography</Heading>
                  {specialistDetails?.members_biography && (
                    <div className="text-white text-biography"
                      dangerouslySetInnerHTML={{ __html: specialistDetails?.members_biography }}
                    />
                  )}

                  {/* <p>{specialistDetails?.members_biography}</p> */}
                </div>
                <div className="callPrice d-md-block d-sm-none">
                  <p>{timeSlot} call price : {currencySymbols[currencySymbol]}{specialistfee}</p>
                </div>
                <div className="biography-content">
                  <textarea name="call_scheduled_reason" id="call_scheduled_reason" rows={2} className="form-control" placeholder="Reason for call" onChange={handleChange}></textarea>
                </div>
                <div className="bookcall-actions">
                  <div className="callPrice">
                    <p>{timeSlot} call price : {currencySymbols[currencySymbol]}{specialistfee}</p>
                  </div>
                  <Button
                    onClick={handleBookCall}
                    text={`Book a call with ${specialistDetails?.members_fname}`}
                    icon={true}
                    theme="light"
                    className="w-100 book-call"
                  />
                </div>
                {callDetails.map((CallSchedules, index) => (

                  CallSchedules.Details.length > 0 && (
                    <div className="Expertbox">
                      <div key={index} className="booked-name">
                        <p>You have booked {specialistDetails?.members_fname} on </p>

                        {CallSchedules.Details.map((detail, detailIndex) => (
                          <div key={detailIndex}>
                            <ul>
                              <li>
                                <p style={{ marginBottom: "0px" }}>{moment(detail.call_scheduled_date, "YYYY-MM-DD").format("DD MMMM YYYY")} {moment(detail.call_scheduled_time, "hh:mm A").format("HH:mm")}</p>
                              </li>
                            </ul>

                          </div>
                        ))}
                      </div>
                    </div>
                  )

                ))}

                <div className="Expertbox">
                  <h5 className="customHeading">{expertDetails?.expert_call_title}</h5>
                  {expertDetails?.expert_call_title && (
                    <div className="text-white text-biography"
                      dangerouslySetInnerHTML={{ __html: expertDetails?.expert_call_description }}
                    />
                  )}

                </div>
              </div>
            </div>
            <div className="col-md-12 col-12 lg-12">
              {ratingDetails && ratingDetails.length > 0 && (
                <div className="rating-parent">
                  <div className="heading-text">
                    <h2 className="Reviews customHeading">Reviews</h2>
                  </div>
                  <div className="container-fluid px-0">
                    <div className="reviews-card">
                      <div className="reviews">
                        <div className="row mx-0">
                          {ratingDetails?.map((review, index) => {
                            let profilePic = '';
                            if (review.member_profile_picture) {
                              profilePic = `${baseUrl}/${review.member_profile_picture}`;
                            }
                            //  const resultStr = showLessList[index] ?  review.review :  review.review.slice(0,500);
                            const exceedsLimit = review.review.length > 250;
                            const resultStr = exceedsLimit
                              ? (showLessList[index] ? review.review : review.review.slice(0, 250))
                              : review.review;
                            return (
                              <div className="col-md-4 col-12 rating-sec">
                                <div className="userrating-section">
                                  <div className="profile-details">
                                    {profilePic ? (
                                      <div className="user-img">
                                        <img src={profilePic} className="img" />
                                      </div>
                                    ) : (
                                      <div className="user-img">
                                        <img
                                          src={require("../assets/images/profile/Default.jpg")}
                                          alt="Profile"
                                          className="profile-image"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="comment-rating" key={index}>
                                    <div className="time">
                                      <span>{review.date}</span>
                                    </div>
                                    <div className={`comments d-block ${showLessList[index] ? 'expanded' : ''}`}>
                                      <span>{resultStr}</span>
                                      {exceedsLimit && (
                                        <p className="readmore d-block" onClick={() => changeShow(index)}>
                                          {showLessList[index] ? 'show less' : 'show more'}
                                        </p>
                                      )}
                                    </div>
                                    <div className="user">
                                      <p>{review.member_name}</p>
                                    </div>

                                    <div className="rating-star d-flex align-items-center justfy-content-center">
                                      <div className="rating">
                                        <StarRating
                                          onClick={handleRating}
                                          size={20}
                                          transition
                                          allowFraction
                                          showTooltip
                                          expertRating={review.rating}
                                          tooltipArray={tooltipArray}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="video-list-container d-none">
            <div className="row">
              <div className="col-md-8 col-12">
                <div className="video-area Related-Videos-section">
                  <Heading tag="h6" className="main-head">
                    More Videos by {specialistDetails?.members_fname}{" "}
                    {specialistDetails?.members_lname}
                  </Heading>
                  <div className="row">
                    {videodatas.map((videoData) => (
                      <div className="col-md-4 col-6" key={videoData.id}>
                        <VideoCard
                          data={videoData}
                          onClick={() =>
                            handleVideoCardClick(videoData.videoUrl)
                          }
                          target={""}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      {
        isModalOpen && (
          <BookModal isOpen={isModalOpen} toggleClose={handleCloseModal} userId={userId} specialistName={specialistDetails?.members_fname} specialistLastName={specialistDetails?.members_lname} timeSlot={timeSlot} specialistDp={specialistDp} changeTimeSlot={changeTimeSlot} reason={reason} bookingId={''} />
        )
      }
    </div >
  );
};

export default SpecialistsDetails;
