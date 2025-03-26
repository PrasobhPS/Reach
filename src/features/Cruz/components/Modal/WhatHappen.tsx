import { Button } from "../../../../components/Button/Button";
import { useState, useEffect } from "react";
import "./ModalMatch.scss";
interface WhatHappenProps {
  handleSubmit?: () => void;
}
export const WhatHappen: React.FC<WhatHappenProps> = ({
  handleSubmit = () => { },
}) => {

  return (
    <div className="Employee-Profilemodal">
      <div className="row">
        <h2 className="customHeading">what happens next?</h2>
        <div className="text-para">
          <p>
            We’ve let the person know you’re interested in them, if they’re interested too, you’ll be connected.
            If you want to learn more about how CRUZ works, tap the link below.
          </p>
        </div>
        <div className="modal-actions">
          <Button
            onClick={() => handleSubmit()}
            text="Continue"
            icon={true}
            theme="light"
            className="w-100 btn-dark"
          />
        </div>
      </div>
    </div>
  )
}
export default WhatHappen;