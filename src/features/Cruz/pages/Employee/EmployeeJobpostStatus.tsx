import React, { useState } from "react";
import { Hero } from "../../../../components/Hero/Hero";
import "../../../../assets/scss/cruz.scss";
import { Button } from "../../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
export const EmployeeJobpostStatus = () => {
    const navigate = useNavigate();
    return (
        <div className="JobpostStatus-page EmployeeJobPostStatus">
            <div className="postStatusPage">
                <Hero
                    source={require("../../../../assets/images/cruz/jobpostBanner.png")}
                    title={'congratulations'}
                />
                <div className="status-text">
                    <span>Your profile is now live</span>
                    <div className="action-btn">
                        <Button
                            onClick={() => navigate('/cruz/employeejobs')}
                            text="Start Looking for Jobs"
                            icon={true}
                            theme="light"
                            className=""
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EmployeeJobpostStatus;