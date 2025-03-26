import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "../../components/Button/Button";
import "./Components/Profile.scss";
import { SingleBookingCard } from "./Components/SingleBookingCard";
import { BookingInterfaces } from "../../types/BookingInterface";
import { BookingbuttonInterfaces } from "../../types/BookingbuttonInterfaces";


interface historyBookingDataProps {
    bookingHistoryData: BookingInterfaces[];
    HistoryButtonDetails: BookingbuttonInterfaces;
    handleSub: (event: React.MouseEvent<HTMLButtonElement>, stepIndex: any) => Promise<void>;

}

let itemCount = 0;
export const History: React.FC<historyBookingDataProps> = ({ bookingHistoryData, HistoryButtonDetails, handleSub }) => {


    let countcons = bookingHistoryData.length;
    const handleSubmit = () => {
        console.log("");
    }
    return (

        <div className="history-tab">
            <div className="container mybooking-tab">
                <div className="myBookingHead">
                    <h2 className="customHeading">History ({countcons})</h2>
                </div>
                {bookingHistoryData && bookingHistoryData.map((detail, index) => {
                    return (
                        <SingleBookingCard key={detail.id || index} SinglecardDetail={detail} SinglecardDetailButtons={HistoryButtonDetails} handleSub={handleSub} />
                    )
                })}
            </div>
        </div>
    );
};

