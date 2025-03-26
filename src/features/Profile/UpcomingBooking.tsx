import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "../../components/Button/Button";
import "./Components/Profile.scss";
import { SingleBookingCard } from "./Components/SingleBookingCard";
import { BookingInterfaces } from "../../types/BookingInterface";
import { BookingbuttonInterfaces } from "../../types/BookingbuttonInterfaces";


interface newBookingDataProps {
    upcomingBookingData: BookingInterfaces[];
    upcomingButtonDetails: BookingbuttonInterfaces;
    handleSub: (event: React.MouseEvent<HTMLButtonElement>, stepIndex: any) => Promise<void>;
}

let itemCount = 0;
export const UpcomingBooking: React.FC<newBookingDataProps> = ({ upcomingBookingData, upcomingButtonDetails, handleSub }) => {
    const upcomingClassName = `booking-table ${upcomingButtonDetails.is_specialistval === "Y" || upcomingBookingData.length <= 0 ? 'd-none' : ''}`.trim();


    let countcons = upcomingBookingData.length;
    const handleSubmit = () => {
        console.log("");
    }
    return (
        <div className="upcomingbooking-tab">
            <div className="container mybooking-tab">
                <div className="myBookingHead">
                    <h2 className="customHeading">Upcoming bookings ({countcons})</h2>
                </div>
                <div className={upcomingClassName}>
                    <table className="table memberBooking-table border-0">
                        <thead>
                            <tr>
                                <th className="dates"></th>
                                <th className="meetingWith">Meeting with</th>
                                <th className="text-center">Time</th>
                                <th>Fee</th>
                                <th className="action-td"></th>
                            </tr>
                        </thead>
                    </table>
                </div>
                {upcomingBookingData && upcomingBookingData.map((detail, index) => {
                    return (
                        <SingleBookingCard key={detail.id || index} SinglecardDetail={detail} SinglecardDetailButtons={upcomingButtonDetails} handleSub={handleSub} />
                    )
                })}
            </div>
        </div>
    );
};

