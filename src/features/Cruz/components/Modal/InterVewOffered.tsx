import { Button } from "../../../../components/Button/Button";
import { useState, useEffect } from "react";
import "./ModalMatch.scss";
export const InterVewOffered = () => {
  return (
    <div className="Employee-ProfilematchModal">
      <div className="row">
        <h2 className="customHeading">INTERVIEW OFFERED</h2>
        <div className="text-para">
          <p>You’ve been invited to an interview</p>
        </div>
        <div className="time-area">
          <span>12 May 2024</span>
          <span>16:00 GMT</span>
        </div>
        <div className="imagegrid">
          <div className="grid">
            <img
              src={require("../../../../assets/images/cruz/gall-1.png")}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="grid">
            <img
              src={require("../../../../assets/images/cruz/gall-2.png")}
              alt=""
              className="img-fluid"
            />
          </div>
        </div>
        <div className="chatOption-btn">
          <Button
            onClick={() => console.log("")}
            text="Chat with the Employer"
            icon={true}
            className="chat-optionbtn"
          />
          <a className="chatlater" onClick={() => console.log("")}>
            Continue & chat later
          </a>
        </div>
      </div>
    </div>
  )
}
export default InterVewOffered;