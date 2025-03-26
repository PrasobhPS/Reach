import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "../../../../components/CustomSlider/CustomSlider";
import { Heading } from "../../../../components/Heading/Heading";
import { Modal, ModalBody } from "reactstrap";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import '../../../../assets/scss/cruz.scss';
import { ReactDatePicker } from "../../../../components/ReactDatePicker/ReactDatePicker";
import moment from 'moment';
import { useSaveJobMutation } from '../../Api/CruzMainApiSlice';
import { useNavigate } from 'react-router-dom';
import { getUserData, setUserData } from '../../../../utils/Utils';
import { CruzLayout } from '../../../../components/Layout/CruzLayout';
import Swal from 'sweetalert2';
import { useGetVarificationStatusMutation } from '../../Api/CampaignApiSlice';

interface FormValues {
    [key: string]: any;
}
interface SubQuestion {
    title: string;
    type: string;
    name: string;
    options: Record<string, string>;
}
interface Option {
    value: string;
    label: string;
}
interface Question {
    title: string;
    type: string;
    options: Record<string, string>;
    name: string;
    sub_questions?: SubQuestion[];
    // Add other relevant fields here
}

interface StepsDetails {
    title: string;
    questions: Question[];
}

interface Step {
    title: string;
    questions: Question[];
}

interface PreviewProps {
    formValues: FormValues;
    steps: Step[];
    handleGoBack: () => Promise<void>;
}
interface Slide {
    image: string;
    alt: string;
}
interface DisplayItem {
    [key: string]: any;
}
interface UserData {
    Member_fullname: string;
    Member_type: string;
    Token: string;
    members_profile_picture: string;
    Member_id: string;
    IsEmployer: string;
    IsEmployee: string;
    is_specialist: string;
}
export const ReviewEmployerPost: React.FC<PreviewProps> = ({
    formValues,
    steps,
    handleGoBack,
}) => {
    const userData: UserData | null = getUserData("userData");
    const stepIndex = 0;
    const questionIndex = 0;

    const [getVarificationStatus] = useGetVarificationStatusMutation();
    const [verificationStatus, setVerificationStatus] = useState<boolean>(false);


    const fetchVarification = async () => {
        const varifyResponse = await getVarificationStatus({});
        if ('data' in varifyResponse) {
            const status = varifyResponse.data;
            if (status.is_doc_verified) {
                setVerificationStatus(true);
            } else {
                setVerificationStatus(false);
            }

        } else {
            setVerificationStatus(false);
        }

    }

    useEffect(() => {
        fetchVarification();
    }, []);

    let formValueName = '';
    let formType = '';
    let displayArray: DisplayItem = {};
    let stepNumber = steps.length;
    let questionNumber = 0;
    for (let i = 0; i < stepNumber; i++) {
        questionNumber = steps[i].questions.length;
        for (let k = 0; k < questionNumber; k++) {
            formValueName = steps[i].questions[k].name;
            formType = steps[i].questions[k].type;
            if (!displayArray) {
                displayArray = {}; // Ensure it's initialized as an object
            }

            if (formValueName != undefined && formType === 'radio') {
                displayArray[formValueName] = steps[i].questions[k].options[formValues[formValueName]]
            } else if (formType === 'textarea' || formType === 'number' || formType === 'date' || formType === 'file') {
                displayArray[formValueName] = formValues[formValueName];
            }
        }

    }


    const baseUrl = process.env.REACT_APP_STORAGE_URL;

    let slides: Slide[] = [];
    let imageNum = 3;

    if (Array.isArray(displayArray['upload_media'])) {
        imageNum = displayArray['upload_media'].length;
        slides = displayArray['upload_media'].map((image: string, index: number) => ({
            image: baseUrl + image,
            alt: `Image ${index + 1}`,
            url: '#',
            isLink: true,
        }));
    }
    const slidesettings = {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: slides.length > 1,
        dots: true,
        centerPadding: "100%",
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    centerPadding: "10%",
                    arrows: false,
                },
            },
        ],
    };

    const [saveJob] = useSaveJobMutation();
    const navigate = useNavigate();

    function validateObjectKeys(obj: FormValues) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const unwantedKeys = ['upload_media', 'job_salary_type', 'job_salary_amount', 'job_currency', 'search_qualification', 'search_age', 'search_gender', 'search_language', 'search_visa', 'vessel_type', 'salary_type'];
                if (!unwantedKeys.includes(key)) {
                    // Check if the value is null or undefined
                    if (value === null || value === undefined) {
                        return true;
                    }
                    // Check if the value is an empty array or an empty object
                    if (Array.isArray(value) && value.length === 0) {
                        return true;
                    }
                    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    const handleSubmit = async () => {
        try {
            const errors = validateObjectKeys(formValues);
            if (errors) {
                Swal.fire({
                    title: "Post Failed!",
                    text: "Please fill up all the details before posting",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false,
                    backdrop: `
                    rgba(255, 255, 255, 0.5)
                    left top
                    no-repeat
                    filter: blur(5px);
                  `,
                    background: '#fff',
                });
                return;
            }
            if (Object.keys(formValues).length != 0) {
                delete formValues.dob;
                formValues.job_status = 'D';
                if (verificationStatus) {
                    formValues.job_status = 'A';
                }
                const response = await saveJob(formValues);
                if ('data' in response) {
                    const jobId = response.data.data.JobId;
                    if (userData != null) {
                        userData.IsEmployer = 'Y';
                        setUserData(userData);
                    }
                    if (verificationStatus) {
                        navigate('/cruz/viewcampaign/livecampaign');
                    } else {
                        navigate('/cruz/register', {
                            state: {
                                jobId: jobId,
                                jobRole: formValues.job_role,
                            },
                        });
                    }
                } else {
                    console.error("Error saving job:", response.error);
                }
            }
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    };
    const BtnSave = async () => {
        try {
            if (Object.keys(formValues).length != 0) {
                delete formValues.dob;
                const response = await saveJob(formValues);
                if ('data' in response) {
                    const jobId = response.data.data.JobId;
                    if (userData != null) {
                        userData.IsEmployer = 'Y';
                        setUserData(userData);
                    }
                    navigate('/cruz/viewcampaign/draftcampaign');
                } else {
                    console.error("Error saving job:", response.error);
                }
            }
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="ReviewEmployer-postpage">
            <div className="review-postpage-parent">
                <div className="container-fluid">
                    <div className="page-path">
                        <div className="parent-direction">
                            <label><a style={{ cursor: "pointer" }} onClick={() => navigate(`/cruz/viewcampaign/livecampaign`)}>Campaigns</a></label>
                        </div>
                        <span className="direction-arrow">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </span>
                        <div className="child-direction">
                            <label> {displayArray['job_role']} for Two Months in the {displayArray['job_location']}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid px-0">
                <div className='row mx-0'>
                    <CruzLayout link="Employer">
                        <div className='col-lg-7 col-12'>
                            <div className="reviewpost-header">
                                <div className="review-post">
                                    <p>REVIEW YOUR POST</p>
                                    <h2 className="customHeading pl-0">REVIEW YOUR JOB ADVERT</h2>
                                </div>
                                <div className="view-profile-section">
                                    <div className="profile-box">
                                        <div className="profile-box-header">
                                            <div className="profile-name">
                                                <Heading>
                                                    {displayArray['job_role']}
                                                </Heading>
                                            </div>
                                        </div>
                                        <div className="profile-box-body">
                                            <ul className="quick-details">
                                                {displayArray['vessel_size'] && (<li> {displayArray['vessel_size'] ? `${displayArray['vessel_size']}m` : ''} {displayArray['boat_type'] ? `${displayArray['boat_type']} ` : 'Yacht'} </li>)}
                                                {displayArray['job_duration'] && (<li>{displayArray['job_duration']}</li>)}
                                                {displayArray['job_location'] && (<li>{displayArray['job_location']}</li>)}
                                            </ul>
                                            <CustomSlider settings={slidesettings} items={slides} />
                                            <div className="employer-custom-card">
                                                <div className="employer-custom-card-title">
                                                    <Heading>THE ROLE</Heading>
                                                </div>
                                                <div className="employer-custom-card-body">
                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Job Title :</label>
                                                        </div>
                                                        <div className='col-xl-9 col-6'>
                                                            <div className="view-data">
                                                                <span>
                                                                    {displayArray['job_role']}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Type of Boat :</label>
                                                        </div>
                                                        <div className='col-xl-9 col-6'>
                                                            <div className="view-data">
                                                                <span>{displayArray['boat_type']}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Duration :</label>
                                                        </div>
                                                        <div className='col-xl-9 col-6'>
                                                            <div className="view-data">
                                                                <span>{displayArray['job_duration']}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Start Date:</label>
                                                        </div>
                                                        <div className='col-xl-9 view-data col-6'>
                                                            <span>{displayArray['job_start_date'] && new Date(displayArray['job_start_date']).toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="employer-custom-card">
                                                <div className="employer-custom-card-title">
                                                    <Heading>THE BOAT</Heading>
                                                </div>
                                                <div className="employer-custom-card-body">
                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Vessel :</label>
                                                        </div>
                                                        <div className='col-xl-9 col-6'>
                                                            <div className="view-data">

                                                                <span style={{ whiteSpace: "pre-line" }}>
                                                                    {displayArray['vessel_desc']}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Location :</label>
                                                        </div>
                                                        <div className='col-xl-9 col-6'>
                                                            <div className="view-data">
                                                                <span>
                                                                    <span>{displayArray['job_location']}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="item-box row">
                                                        <div className='options-heading'>
                                                            <label>Size: </label>
                                                        </div>
                                                        <div className='col-xl-9 col-6'>
                                                            <div className="view-data">
                                                                <span>
                                                                    <span>{displayArray['vessel_size'] ? `${displayArray['vessel_size']}m` : ""} {displayArray['boat_type'] ? `${displayArray['boat_type']} ` : "Yacht"} </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="employer-custom-card">
                                                <div className="employer-custom-card-title">
                                                    <Heading>summary</Heading>
                                                </div>
                                                <div className="employer-custom-card-body">
                                                    <div className="item-box">
                                                        <span style={{ whiteSpace: "pre-line" }}>{displayArray['job_summary']}
                                                        </span>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-12">
                            <div className="postjob-action">
                                <Button
                                    onClick={handleSubmit}
                                    text="Post Job"
                                    icon={true}
                                    theme="light"
                                    className="w-100"
                                    iconname={faAngleRight}
                                />
                                <div className="prev-action">
                                    <Button
                                        text="Go back"
                                        icon={false}
                                        className="btn-prev"
                                        onClick={handleGoBack}
                                    />
                                    <Button
                                        text="Save and exit"
                                        icon={false}
                                        className="btn-save"
                                        onClick={BtnSave}
                                    />
                                </div>
                            </div>
                        </div>
                    </CruzLayout>
                </div>
            </div>
        </div>
    )
}
export default ReviewEmployerPost;


