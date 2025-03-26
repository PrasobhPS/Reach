import { Heading } from '../../../../components/Heading/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import './reviewJobEmployer.scss';
import { Hero } from '../../../../components/Hero/Hero';
import { Button } from "../../../../components/Button/Button";
import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { useEmployerProfileQuery } from '../EmployerProfile/EmployerProfileApiSlice';
import { useSaveJobMutation } from '../../Api/CruzMainApiSlice';
import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, setUserData } from '../../../../utils/Utils';
import Swal from 'sweetalert2';
import { useGetVarificationStatusMutation } from '../../Api/CampaignApiSlice';
import moment from 'moment';
interface Media {
    media_file: string;
}
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
    sub_index: number;
    // Add other relevant fields here
}

interface StepsDetails {
    title: string;
    questions: Question[];
}

interface Step {
    title: string;
    StepsDetails: StepsDetails;
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
interface ReviewProps {
    formValues: FormValues;
    steps: Step;
    handlePreview: () => Promise<void>;
    handleGoBack: (stepIndex: any, questionIndex: any) => Promise<void>;
}
export const ReviewJobEmployerProfile: React.FC<ReviewProps> = ({
    formValues,
    steps,
    handlePreview,
    handleGoBack,
}) => {
    // const { data, error, isLoading, isSuccess } = useEmployerProfileQuery(1);
    // const medias: Media[] = data?.data.mediaDetails || [];
    const [saveJob] = useSaveJobMutation();
    const navigate = useNavigate();
    const [images, setImages] = useState<string[]>([]);
    const [imageKey, setImageKey] = useState(0);
    const [questionKey, setQuestionKey] = useState(0);
    const userData: UserData | null = getUserData("userData");
    const [invalidFields, setInvalidFields] = useState<string[]>([]);
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

    useEffect(() => {
        const extractedImages: string[] = [];

        (steps as any).forEach((step: any, stepIndex: number) => {
            step.questions.forEach((question: { type: string; name: string | number; }, questionIndex: number) => {
                if (question.type === 'file') {
                    setImageKey(stepIndex);
                    setQuestionKey(questionIndex)
                    if (Array.isArray(formValues[question.name])) {
                        formValues[question.name].forEach((image: string) => {
                            extractedImages.push(image);
                        });
                    }
                }
            });
        });
        setImages(extractedImages);
    }, [formValues, steps]);

    function validateObjectKeys(obj: FormValues): string[] {
        const invalidKeys: string[] = [];
        try {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    const unwantedKeys = [
                        'upload_media', 'job_salary_type', 'job_salary_amount',
                        'job_currency', 'search_qualification', 'search_age',
                        'search_gender', 'search_language', 'search_visa', 'vessel_type', 'salary_type'
                    ];
                    if (!unwantedKeys.includes(key)) {
                        if (value === null || value === undefined) {
                            invalidKeys.push(key);
                        }
                        if (Array.isArray(value) && value.length === 0) {
                            invalidKeys.push(key);
                        }
                        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
                            invalidKeys.push(key);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error occurred during validation:', error);
        }
        return invalidKeys;
    }


    const handleSubmit = async () => {
        try {
            const errors = validateObjectKeys(formValues);
            if (errors.length > 0) {
                setInvalidFields(errors); // Highlight invalid fields

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
                    if (response.data.data.jobStatus === 'A') {
                        navigate('/cruz/viewcampaign/livecampaign');
                    } else {
                        navigate('/cruz/viewcampaign/draftcampaign');
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
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formatDate = (dateStr: string): string => {
        if (dateStr) {
            const [year, month, day] = dateStr?.split('-');
            return `${day}-${month}-${year}`;
        }
        return '';
    };

    return (
        <div className="col-lg-12 ">

            <div className="reviewEmployeeprofile-pageparent">
                <CruzLayout link="Employer">
                    <div className="container">
                        <div className="row">
                            <div className="inner-bodypage Employeeprofile pb-0">
                                <div className="page-path">
                                    <div className="parent-direction">
                                        <label><a style={{ cursor: "pointer" }} onClick={() => navigate(`/cruz/viewcampaign/livecampaign`)}>Set up Campaign</a></label>
                                    </div>
                                    <span className="direction-arrow">
                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </span>
                                    <div className="child-direction">
                                        <label>Review your Campaign</label>
                                    </div>
                                </div>
                                <h2 className="customHeading">Review your CAMPAIGN</h2>
                                <div className="table-datats">
                                    <div className="row">
                                        <div className="col-lg-6 col-12">
                                            <div className="table-content">

                                                {steps && Object.entries(steps).map(([key, StepsDetails]) => {

                                                    return (
                                                        <div className="table-details" key={key}>

                                                            <div className='table-datadetails'>
                                                                <div className='details-card'>
                                                                    <label className="odd">{StepsDetails.title}</label>
                                                                </div>
                                                                <div className='details-card-body'>
                                                                    {StepsDetails.questions && Object.entries<Question>(StepsDetails.questions).map(([index, question]) => {
                                                                        const isInvalid = invalidFields.includes(question.name);
                                                                        const isSalaryTypeValid = Object.keys(question?.sub_questions?.[0]?.options || {}).includes(formValues['salary_type']);

                                                                        //     console.log('valuee--', formValues[question.name]);

                                                                        return (
                                                                            <React.Fragment key={index}>
                                                                                <div className={`data-listQuestion ${isInvalid ? 'invalid-field' : ''} ${question.title === 'Vessel' ? 'block-class' : ''}  ${question.title === 'SUMMARY OF THE ROLE' ? 'block-class' : ''}`} key={index} >
                                                                                    <div className="odd-questiontitle">
                                                                                        <h5>
                                                                                            {question.type != 'file' &&
                                                                                                question.title}
                                                                                        </h5>
                                                                                    </div>
                                                                                    <div className="even-QuestionAns">
                                                                                        <span style={{ marginRight: "10px" }}>
                                                                                            {question.options && question.options[formValues[question.name]]}

                                                                                            {question.sub_questions && question.title?.toUpperCase() === 'SALARY' &&
                                                                                                (isSalaryTypeValid ? (
                                                                                                    formValues['salary_type']
                                                                                                ) : (

                                                                                                    formValues[question.sub_questions[2].name]?.['amount'] && (
                                                                                                        <>
                                                                                                            {question.sub_questions[2]?.options?.[formValues[question.sub_questions[2].name]?.['currency']]}
                                                                                                            {' '}
                                                                                                            {Intl.NumberFormat('en-US').format(formValues[question.sub_questions[2].name]?.['amount'])}
                                                                                                        </>
                                                                                                    )


                                                                                                ))
                                                                                            }


                                                                                            {!question.options && !question.sub_questions && question.type != 'file' && question.name != 'job_start_date' &&
                                                                                                <div className="text-white text-biography" style={{ whiteSpace: "pre-line" }}>
                                                                                                    {formValues[question.name]}
                                                                                                </div>
                                                                                            }
                                                                                            {question.name === 'job_start_date' &&
                                                                                                <>{formatDate(formValues[question.name])}</>
                                                                                            }
                                                                                        </span>
                                                                                        {question.type != 'file' ? (
                                                                                            <a onClick={() => handleGoBack(StepsDetails.index - 1, question.sub_index - 1)}>
                                                                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                                                            </a>
                                                                                        ) : ""}

                                                                                    </div>
                                                                                </div>

                                                                                {question.type != 'salary' && question.sub_questions && question.sub_questions.map((subquestion, subIndex) => (
                                                                                    <div className='sub-Questionsdata' key={`${index}-${subIndex}`}>
                                                                                        <h5 className="subQuestion-title">
                                                                                            {subquestion.title}
                                                                                        </h5>
                                                                                        <div className="sub-QuestionAnsdata">
                                                                                            <span style={{ marginRight: "10px" }}>
                                                                                                {formValues[subquestion.name] && (
                                                                                                    Object.values(formValues[subquestion.name])
                                                                                                        .map((index: any) => subquestion.options[index])
                                                                                                        .join(', ')
                                                                                                )}
                                                                                            </span>
                                                                                            <a onClick={() => handleGoBack(StepsDetails.index - 1, question.sub_index - 1)}>
                                                                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </React.Fragment>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-12 right-block">
                                            <div className="table-content">
                                                <div className="table-details grid-tablegallery">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th className="odd">media</th>
                                                                <th className="even">
                                                                    <a onClick={() => handleGoBack(imageKey, questionKey)}>
                                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                                    </a>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan={2}>
                                                                    <div className="grid-gallery">
                                                                        {images && images.map((image, key) => {
                                                                            const className =
                                                                                key % 2 === 0 ? "even col-6 " : "odd col-6";
                                                                            return (
                                                                                <div className={className} key={key}>
                                                                                    <div className="image-grid">
                                                                                        <img
                                                                                            src={baseUrl + image}
                                                                                            alt=""
                                                                                            className="img-fluid"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-12">
                                            <div className="action-field">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="card-content">
                                                            <Button
                                                                text="Preview This Campaign"
                                                                icon={false}
                                                                className="btn-prev btn-transparent"
                                                                onClick={handlePreview}
                                                            />
                                                            <p>

                                                                When you’re satified with your choices, click below.
                                                                You can edit and update your profile at any time.
                                                            </p>
                                                            <div className="btn-action">
                                                                <Button
                                                                    onClick={handleSubmit}
                                                                    text="Post"
                                                                    icon={true}
                                                                    theme="light"
                                                                    className="w-100"
                                                                />
                                                            </div>
                                                            <div className="action-button">
                                                                <div className="prev-action">
                                                                    <Button
                                                                        text="Go Back"
                                                                        icon={false}
                                                                        className="btn-prev"
                                                                        onClick={() => handleGoBack(-1, 0)}
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CruzLayout>
            </div>
        </div >
    )
}