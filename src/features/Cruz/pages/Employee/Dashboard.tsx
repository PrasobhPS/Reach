import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faEye, faCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { Button } from "../../../../components/Button/Button";
import "../../../../assets/scss/cruz.scss";
import { useGetProfileDashboardQuery } from '../../Api/ProfileApiSlice';
import { useEmployeeMyMatchesQuery, useEmployeeProfileQuery } from '../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice';
import { useNavigate } from 'react-router-dom';
import EmployeeMyMatches from './EmployeeMyMaches';
import { LikeCard } from '../../components/LikeCard/LikeCard';
import { getUserData } from '../../../../utils/Utils';
import { useSocket } from '../../../../contexts/SocketContext';
import { useGetChatMemberMutation } from '../../Api/CruzMainApiSlice';

interface Matches {
    date: string;
    id: number;
    job_images: string;
    job_location: string;
    job_role: string;
    member_id: number;
    member_name: string;
}
interface Media {
    id: number;
    media_file: string;
}
interface RawData {
    date: string;
    id: number;
    job_images: string;
    job_location: string;
    job_role: string;
    member_id: number;
    member_name: string;
}
interface MatchesRaw {
    id: number;
    employee_role: string;
    member_name: string;
    members_profile_picture: string;
    date: string;
    member_id: number;
}
export const Dashboard = () => {

    const { data: dashboardData, error: dashboardError, isLoading: isDashboardLoading, isSuccess: isDashboardSuccess, refetch } = useGetProfileDashboardQuery({});
    const matches: Matches[] = dashboardData?.data?.matches;
    const jobCount = dashboardData?.data?.job_count;
    const job_images = dashboardData?.data?.job_images;
    const job_ids = dashboardData?.data?.job_ids;
    const { data: employeeData, error: employeeError, isLoading: isEmployeeLoading, isSuccess: isEmployeeSuccess } = useEmployeeProfileQuery({});
    const employeeProfile = employeeData?.data.employeeDetails;
    const medias: Media[] = employeeData?.data.mediaDetails || [];
    const searchParameter = employeeData?.data.searchParameterName;
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const navigate = useNavigate();
    const [gridLength, setGridLength] = useState(0);

    useEffect(() => {
        refetch();
        window.scrollTo(0, 0);
    }, []);

    const { data, error, isLoading, isSuccess } = useEmployeeMyMatchesQuery({});
    const rawData: RawData[] = data?.data;
    const matchesRaw: MatchesRaw[] = rawData?.map(item => ({
        id: item.id,
        employee_role: item.job_role,
        member_name: item.member_name,
        members_profile_picture: item.job_images,
        date: item.date,
        member_id: item.member_id,
    }));
    const userData = getUserData('userData');
    const [employeeId, setEmployeeId] = useState<string | undefined>('');
    let memberName = '';

    useEffect(() => {
        if (userData) {
            memberName = userData.Member_fullname;
            setEmployeeId(userData.employeeId);
        }
    }, [userData])
    const { setIsChatVisible, setPrivateChatMember, setIsInterview, setEmployeeDetails, setChatType } = useSocket();
    const [chatMemberDetails] = useGetChatMemberMutation();

    const handleChat = async (jobId: number) => {
        let profileData = {
            id: jobId,
            type: 'employer',
        }
        const response = await chatMemberDetails(profileData);
        if ('data' in response && response.data) {
            setIsInterview(false);
            setChatType('CRUZ');
            setPrivateChatMember(response.data.data);
            setIsChatVisible(true);
            if (employeeId) {
                setEmployeeDetails({
                    employee_id: employeeId,
                    job_id: jobId
                });
                //setPrivateChatMember(matches);
                setIsChatVisible(true);
            }
        }
    };

    return (
        <div className="employee-dashboard">
            <CruzLayout link="Employee">
                <div className="dashboard-employee">
                    <div className="page-path">
                        <div className="parent-direction">
                            <label>Dashboard</label>
                        </div>
                        <span className="direction-arrow">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </span>
                    </div>
                    <div className="dashboard-details">
                        <div className="head-details">
                            <h2 className="cutsomHeading">welcome back, {employeeProfile?.members_fname +
                                " " +
                                employeeProfile?.members_lname}</h2>
                        </div>
                        <div className='New-Jobs-view'>
                            <div className="row">
                                <div className="col-lg-4 col-12">
                                    {job_images && job_images.length > 0 ? (
                                        <div className={`grid-gallery ${job_images.length < 3 && job_images.length == 2 ? 'gridtwo-card' : ''}`}>
                                            {job_images && job_images.slice(0, 3).map((image: string, index: number) => (
                                                <div className="grid" key={index}>
                                                    <img
                                                        src={baseUrl + image}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </div>
                                            ))}

                                        </div>
                                    ) : (
                                        <div className="grid-gallery grid-single-image">
                                            <div className="grid">
                                                <img src={require("../../../../assets/images/profile/profile-1.png")} alt="" className="img-fluid" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-8 col-12">
                                    <div className="job-details-view">
                                        <div className="Jobs-viewDetails">
                                            <h2 className="customHeading">{jobCount} New Jobs available</h2>
                                            <p className="Matching">Matching Your Skills based on</p>
                                            <div className='search-parameter'>
                                                <div className="Matching matchlist">
                                                    <label>{employeeProfile?.employee_role}</label>
                                                    {searchParameter && (
                                                        Object.keys(searchParameter).map((key) => (
                                                            <label key={key}>
                                                                {Array.isArray(searchParameter[key]) ? (
                                                                    searchParameter[key].join(", ")
                                                                ) : (
                                                                    searchParameter[key]
                                                                )}
                                                            </label>
                                                        ))
                                                    )}

                                                </div>
                                            </div>
                                            <div className='viewpost-btn'>
                                                <Button
                                                    onClick={() =>
                                                        jobCount > 0
                                                            ? navigate(
                                                                `/cruz/employerviewsjobs`,
                                                                {
                                                                    state: {
                                                                        employee_id: employeeProfile?.employee_id,
                                                                        job_ids: job_ids,
                                                                        jobCount: jobCount,
                                                                    },
                                                                }
                                                            )
                                                            : ""
                                                    }
                                                    text="View Now"
                                                    icon={true}
                                                    theme="light"
                                                    className="button-reverse"
                                                    iconname={faEye}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="Recent-conversation">
                            <div className='d-flex align-items-center justify-content-between'>

                                <div className="action-link">
                                    <a onClick={() =>
                                        navigate(
                                            `/cruz/employeemymatches`,
                                        )
                                    }>All Matches</a>
                                </div>
                            </div>
                            <div className="conversation-list">
                                <LikeCard matches={matchesRaw} type={"employee"} getId={employeeId} handleLike={handleChat} showButton={false} />
                            </div>
                        </div>

                    </div>

                </div>
            </CruzLayout>
        </div>
    )
}
export default Dashboard;