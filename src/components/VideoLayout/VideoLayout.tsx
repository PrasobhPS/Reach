import React, { useState, useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import './VideoLayout.scss';
export const VideoLayout = () =>{
    return(
        <div className="videolayout-parent">
            <div className="iframe-div">
                <h2>Video</h2>
            </div>
        </div>
    )
}
export default VideoLayout;