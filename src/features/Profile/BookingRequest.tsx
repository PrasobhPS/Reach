import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "../../components/Button/Button";
import "./Components/Profile.scss";
import { SingleBookingCard } from "./Components/SingleBookingCard";
import { BookingInterfaces } from "../../types/BookingInterface";
import { BookingbuttonInterfaces } from "../../types/BookingbuttonInterfaces";


interface newBookingDataProps {
  newBookingData: BookingInterfaces[];
  BookingreqButtonDetails: BookingbuttonInterfaces;
  handleSub: (event: React.MouseEvent<HTMLButtonElement>, stepIndex: any) => Promise<void>;
}

let itemCount = 0;
export const BookingRequest: React.FC<newBookingDataProps> = ({ newBookingData, BookingreqButtonDetails, handleSub }) => {


  let countcons = newBookingData.length;
  const handleSubmit = () => {
    console.log("");
  }
  return (

    <div className="container mybooking-tab">
      <div className="myBookingHead">
        <h2 className="customHeading">new booking requests ({countcons})</h2>
      </div>
      {newBookingData && newBookingData.map((detail, index) => {
        return (
          <SingleBookingCard key={detail.id || index} SinglecardDetail={detail} SinglecardDetailButtons={BookingreqButtonDetails} handleSub={handleSub} />
        )
      })}
    </div>
  );
};


