import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/cruz.scss";
import { Button } from "../../../../components/Button/Button";
import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { useSetStatusMutation } from "../../Api/ProfileApiSlice";
import { getUserData, setUserData } from "../../../../utils/Utils";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";

export const SetStatus = () => {
    let statusArray = {
        'A': 'active',
        'I': 'inactive',
    };

    const [currentStatus, setCurrentStatus] = useState<string | undefined>('');
    const [activeButton, setActiveButton] = useState('');
    const [message, setMessage] = useState<string>('');
    const userData = getUserData("userData");
    useEffect(() => {

        if (userData !== null) {
            setCurrentStatus(userData.employee_status);
        }
    }, []);

    useEffect(() => {
        if (currentStatus) {
            setActiveButton(statusArray[currentStatus as keyof typeof statusArray]);
        }
    }, [currentStatus]);


    const handleButtonClick = (button: string) => {
        setActiveButton(button);
    };
    const [setStatus] = useSetStatusMutation();
    const handleSubmit = async () => {
        try {
            setMessage('');
            let status = 'A';
            if (activeButton === 'inactive') {
                status = 'I';
            }
            let saveStatus = {
                employee_status: status,
            };
            const response = await setStatus(saveStatus);
            if ('data' in response) {
                setCurrentStatus(status)
                if (userData != null) {
                    userData.employee_status = status;
                    setUserData(userData);
                }
                setMessage(`Status Changes Successfully to ${activeButton}`);
            } else {
                console.error("Error saving job:", response.error);
                setMessage('');
            }
        } catch {

        }

    }
    return (
        <div className="SetStatus-page">
            <CruzLayout link="Employee">
                <div className="setUppage-content w-100">
                    <Breadcrumbs mainbreadcrumb="Dashboard" secondbreadcrumb="Set up Status" redirectUrl="/cruz/employeedashboard" />
                    <div className="page-content">
                        <h2 className="customHeading">Set status</h2>
                        <div className="row">
                            <div className="active-inactive col-xl-7  col-md-6  col-12">
                                <Button
                                    onClick={() => handleButtonClick('active')}
                                    text="Active"
                                    icon={false}
                                    theme="light"
                                    className={activeButton === 'active' ? 'active' : ''}
                                />
                                <Button
                                    onClick={() => handleButtonClick('inactive')}
                                    text="Inactive"
                                    icon={false}
                                    theme="light"
                                    className={activeButton === 'inactive' ? 'active' : 'Inactive'}
                                />
                                <div id="card-errors" role="alert" style={{ color: 'green' }}>
                                    {message}
                                </div>
                            </div>
                            <div className="layout-action col-xl-5  col-md-6  col-12">
                                <div className="content-text">
                                    <p>When set to ‘Inactive’ your profile will not appear on searches.</p>
                                    <Button
                                        onClick={handleSubmit}
                                        text="Set Status"
                                        icon={true}
                                        theme="light"
                                        className=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CruzLayout>
        </div>
    );
}

export default SetStatus;
