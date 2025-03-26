import { Button } from "../../../../components/Button/Button"
import { BookingInterfaces } from "../../../../types/BookingInterface";
import { useAcceptStatusMutation } from "../../MyBookingApiSlice";
import { BookingbuttonInterfaces } from "../../../../types/BookingbuttonInterfaces";
import moment from "moment";
import 'moment-timezone';
import { useState } from "react";



interface singlecardProps {
  //newBookingData: BookingInterfaces[] | undefined;
  SinglecardDetail: BookingInterfaces;
  SinglecardDetailButtons: BookingbuttonInterfaces;
  handleSub: (
    event: React.MouseEvent<HTMLButtonElement>,
    SinglecardDetail: any
  ) => Promise<void>;
  //handleSub: (event: React.MouseEvent<HTMLButtonElement>,stepIndex: any,memImage:string,callDate:Date,callTime:string,specialist_id:any) => Promise<void>;
}


export const SingleBookingCard = ({ SinglecardDetail, SinglecardDetailButtons, handleSub }: singlecardProps) => {

  const [timezone, setTimezone] = useState<string>('Europe/London');

  const handleSubmit = () => {
    console.log("");
  }
  const handleJoin = () => {
    window.open(SinglecardDetail.meeting_link, '_blank');
  }

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(SinglecardDetail.fee)
  const className = `booking-detailsTable ${SinglecardDetailButtons.btnClassname ? SinglecardDetailButtons.btnClassname : ''}`.trim();
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const histclassName = `joinAll ${SinglecardDetailButtons.is_specialistval === "Y" && SinglecardDetailButtons.bookingTab === "MyBookings1" && SinglecardDetailButtons.btnText === "Book Again" ? 'd-none' : ''}`.trim();
  const rearrClassName = 'Rearrange';
  const upcomingCanRearrange = `grp-btn ${SinglecardDetail.call_status == 'A' && (SinglecardDetailButtons.is_specialistval !== "Y" || SinglecardDetailButtons.bookingTab === "MyBookings2") ? 'd-none' : ''}`.trim();

  const hideAccept = `${SinglecardDetail.call_status == 'R' ? 'd-none' : ''}`;

  let btnClassName = false;
  if (SinglecardDetailButtons.btnText === "Join Call" && !SinglecardDetail.showCall) {
    btnClassName = true;
    SinglecardDetailButtons.btnTheme = 'grey';
  } else if (SinglecardDetailButtons.btnText === "Join Call") {
    SinglecardDetailButtons.btnTheme = 'light';
  }
  let buttonTextShow = SinglecardDetailButtons.btnText;
  if ((SinglecardDetail.call_status === 'P' || SinglecardDetail.call_status === 'A') && SinglecardDetailButtons.btnText === 'Book Again') {
    buttonTextShow = 'Rearrange';
  }
  return (
    <div>
      <div className={className}>
        <div className="booking-detailsTable">
          <div className="booking-tabledata">
            <div className="d-block">
              <div className="tabledata">
                <div className="dateSection-card">
                  <div className="date-section">
                    <h2 className="customHeading">{SinglecardDetail.day}</h2>
                    <div className="month">
                      <span>{SinglecardDetail.month}</span>
                    </div>
                  </div>
                </div>
                <div className="details">
                  <div className="details-content">
                    <div className="profiledetails">
                      <div className="profile-section">
                        <div className="image-section">
                          <img
                            src={
                              SinglecardDetail.member_image
                                ? baseUrl + SinglecardDetail.member_image
                                : require("../../../../assets/images/profile/Default.jpg")
                            }
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="profile-details">
                          <h2 className="customHeading">
                            {SinglecardDetail.firstName}{" "}
                            {SinglecardDetail.lastName}
                          </h2>
                          <p>{SinglecardDetail.members_country}</p>
                        </div>
                      </div>
                    </div>
                    <div className="timesprice-details">
                      <div className="times">
                        <div className="time-details">
                          <span className="time">
                            {SinglecardDetail.time}
                          </span>
                          <span className="location">London (GMT)</span>
                        </div>
                      </div>
                      <div className="pricedetails">
                        <div className="price">
                          <h4 className="customHeading">
                            {SinglecardDetail.currency}
                            {SinglecardDetail.fee > 0
                              ? formattedNumber
                              : "0.00"}
                          </h4>
                          <p>Fee Paid</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="upcomingbooking-details">
                <p>
                  {SinglecardDetail.call_scheduled_reason}
                </p>
              </div>
            </div>
            <div className="action-field">
              <div className="action">
                <div className="grp-btn ">
                  {SinglecardDetail.showCancel && (
                    <div className="cancel">
                      <Button
                        onClick={(event) => handleSub(event, SinglecardDetail)}
                        text={SinglecardDetailButtons.btnSmallText}
                        icon={false}
                        theme="light"
                        className="btn-cancel"
                      />

                    </div>
                  )}

                  {SinglecardDetail.showRearrange && (
                    <div className={rearrClassName}>
                      <Button
                        onClick={(event) => handleSub(event, SinglecardDetail)}
                        text="Rearrange"
                        icon={false}
                        theme="light"
                        className="btn-Rearrange Rearrange-btn"
                      />

                    </div>
                  )}
                </div>

                <div className={`${histclassName} ${hideAccept}`}>
                  <Button
                    onClick={(event) => handleSub(event, SinglecardDetail)}
                    text={buttonTextShow}
                    icon={true}
                    theme={SinglecardDetailButtons.btnTheme}
                    className="w-100"
                    disabled={btnClassName}
                  />
                </div>
                {SinglecardDetail.call_status === 'R' && SinglecardDetailButtons.bookingTab === "MyBookings2" && (
                  <Button
                    onClick={(event) => handleSub(event, SinglecardDetail)}
                    text="Accept"
                    icon={true}
                    theme={"light"}
                    className="w-100"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default SingleBookingCard