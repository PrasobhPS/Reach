import React, { useState } from "react";
import { Hero } from "../../../../components/Hero/Hero";
import "../../../../assets/scss/cruz.scss";
import { Button } from "../../../../components/Button/Button";
export const JobPostStatus = () => {
    return (
        <div className="JobpostStatus-page">
            <div className="postStatusPage">
                <Hero
                    source={require("../../../../assets/images/cruz/banner-slide.png")}
                    title={'congratulations'}
                />
                <div className="status-text">
                    <span>Your post is now live</span>
                    <div className="action-btn">
                        <Button
                            onClick={() => console.log("Hello")}
                            text="Start Looking for Crew"
                            icon={true}
                            theme="light"
                            className=""
                        />
                       
                    </div>
                </div>
            </div>
        </div>
    );
};



export default JobPostStatus;
