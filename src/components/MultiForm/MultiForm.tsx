import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Progress } from 'reactstrap';
import "./MultiStepForm.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../components/Button/Button";
import { MultiStepFormProps } from "../../types/MultiStepFormInterface";
import { useGetJobQuestionsQuery, useSaveJobMutation, useGetJobDetailsMutation } from '../../features/Cruz/Api/CruzMainApiSlice';
import Steps from './Steps';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReviewJobEmployerProfile } from '../../features/Cruz/components/ReviewJobEmployerProfile/ReviewJobEmployerProfile';
import ReviewEmployerPost from '../../features/Cruz/pages/Employer/ReviewEmployerPost';
import { getUserData, setUserData } from '../../utils/Utils';
import { Breadcrumbs } from '../../features/Cruz/components/Breadcrumbs/Breadcrumbs';

export interface Step {
    title: string;
    questions: any[];
}

interface FormValues {
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

export const MultiForm = (props: MultiStepFormProps) => {



    const form = useForm<FormValues>();
    const { data, error, isLoading, refetch } = useGetJobQuestionsQuery({});
    const [saveJob] = useSaveJobMutation();
    const steps = data?.data?.steps || [];
    const [stepIndex, setStepIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const { register, control, handleSubmit, formState, watch, setValue } = form;
    const currentStep = steps[stepIndex];
    const currentTitle = currentStep ? currentStep.title : "";
    const [validationName, setValidationName] = useState('');
    const [disError, setDisError] = useState(0);
    const [checkQuestion, setCheckQuestion] = useState(1);
    const userData: UserData | null = getUserData("userData");
    const [isReview, setIsReview] = useState<boolean>(false);
    const [isJobDetailsFetched, setIsJobDetailsFetched] = useState(false);
    const [review, setReview] = useState(0);
    const [jobRole, setJobRole] = useState<string>('');

    // Watch all form values
    const formValues = watch();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        firstIndex = '',
        secondIndex = '',
    } = location.state || {};

    let redirect = '/cruz/';


    const [getJobDetails, { data: jobData, error: jobError, isLoading: jobLoading }] = useGetJobDetailsMutation();
    const [isLoadings, setIsLoading] = useState(false);
    const fetchJobDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getJobDetails({ id: id });
            if ('data' in response) {
                const jobDetails = response.data.data;
                for (const key in jobDetails) {
                    if (key === 'job_start_date' && jobDetails[key] != null) {
                        // const editdate = moment(jobDetails[key], "DD-MM-YYYY");
                        // const formattedDate = editdate.format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ ');
                        const dateObject = new Date(jobDetails[key]);
                        handleDateSelect(dateObject);
                    }
                    if (key === 'job_role') {
                        setJobRole(jobDetails[key]);
                    }
                    setValue(key, jobDetails[key]);
                }
                setIsJobDetailsFetched(true);
            } else if ('error' in response) {
                // Handle the error case
                console.error("Error response received:", response.error);
            }
        } catch (error) {
            console.error("Failed to fetch specialist list:", error);
        } finally {
            setReview(1);
            setIsLoading(false);
        }

    };

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        } else {
            setIsJobDetailsFetched(true);
        }
    }, [id]);
    useEffect(() => {

        setIsJobDetailsFetched(true);
    }, []);
    useEffect(() => {
        if (firstIndex !== '') {
            setStepIndex(firstIndex);
        }
        if (secondIndex !== '') {
            setQuestionIndex(secondIndex);
        }
    }, [firstIndex, secondIndex]);

    useEffect(() => {
        refetch();
    }, [refetch]);


    const handleContinue = () => {
        let allNames = [];
        let currentQuestion = steps[stepIndex].questions[questionIndex];
        let currentName = currentQuestion.name;

        if (currentName) {
            allNames.push(currentName);
        }
        if (currentQuestion.sub_questions) {
            const subQuestionNames = currentQuestion.sub_questions.map((subQuestion: any) => subQuestion.name);
            allNames = allNames.concat(subQuestionNames);
        }

        let salaryPickerValid = formValues['salary_picker']
            && formValues['salary_picker'].currency !== ''
            && formValues['salary_picker'].amount !== ''
            && formValues['salary_picker'].amount !== null
            && formValues['salary_picker'].amount !== '0';

        let salaryTypeValid = formValues['job_salary_type']
            && formValues['job_salary_type'] !== ''
            && formValues['job_salary_type'] !== undefined;

        let jobSalaryTypeValid = formValues['salary_type']
            && formValues['salary_type'] !== ''
            && formValues['salary_type'] !== undefined
            && formValues['salary_type'] !== null;
        let isValid = allNames.every(name => {
            if (name === 'upload_media') {
                return true;
            }
            if (name === 'salary_picker' || name === 'job_salary_type' || name === 'salary_type') {
                return (salaryPickerValid && salaryTypeValid) || jobSalaryTypeValid;
            }
            return formValues[name] !== '' && formValues[name] !== undefined && formValues[name] !== null;
        });

        if (!isValid) {

            // Determine appropriate validation message
            if (allNames.includes('salary_picker') || allNames.includes('job_salary_type') || allNames.includes('salary_type')) {
                if (salaryPickerValid && !salaryTypeValid) {
                    setValidationName("Please select salary type");
                } else if (!salaryPickerValid && salaryTypeValid) {
                    setValidationName("Please enter salary");
                } else {
                    setValidationName(currentQuestion.validation);
                }
            } else {
                setValidationName(currentQuestion.validation);
            }
            setDisError(1);
        } else {
            if (((stepIndex + 1) / steps.length) === 1 && steps[stepIndex].questions.length === (questionIndex + 1)) {
                setReview(1);
            } else {
                setCheckQuestion(prevCheckQuestion => prevCheckQuestion + 1);
                setDisError(0);
                setQuestionIndex(prevQuestionIndex => prevQuestionIndex + 1);
                if (steps[stepIndex].questions.length - 1 === questionIndex) {
                    setStepIndex(prevStepIndex => prevStepIndex + 1);
                    setQuestionIndex(0);
                }
            }
        }
    };


    const handleGoBack = () => {

        if (id && stepIndex <= 0 && questionIndex === 0) {
            navigate(-1);
        }
        setDisError(0);
        setQuestionIndex(prevQuestionIndex => prevQuestionIndex - 1);
        if (questionIndex === 0 && stepIndex > 0) {
            setStepIndex(prevStepIndex => prevStepIndex - 1);
            setQuestionIndex(steps[stepIndex].questions.length);
        }
        if (stepIndex <= 0 && questionIndex === 0) {
            navigate(redirect);
        }
    };

    const handleReset = () => {
        setStepIndex(0);
        setQuestionIndex(0);
    };

    const handleOptionChange = (name: string, optionKey: any, type: string, isChecked: boolean | undefined) => {
        if (type === 'radio') {
            setValue(name, optionKey);
            if (name === 'salary_type') {
                setValue('job_salary_type', '');
                setValue('salary_picker.amount', '');
            }
            if (name === 'job_salary_type') {
                setValue('salary_type', '');
            }
        } else if (type === 'checkbox') {
            const currentValue = Array.isArray(formValues[name]) ? formValues[name] : [];
            let updatedValue;
            if (isChecked) {
                updatedValue = [...currentValue, String(optionKey)];
            } else {
                updatedValue = currentValue.filter((value: string) => String(value) !== String(optionKey));
            }
            setValue(name, updatedValue);
        }
    };

    const [startDate, setSelectedDate] = useState<Date | null>(null);
    const handleDateSelect = (date: Date | null) => {
        setSelectedDate(date);
        setValue('job_start_date', moment(date).format('YYYY-MM-DD'));

        const year = moment(date).format('YYYY');
        const month = moment(date).format('MM');
        const day = moment(date).format('DD');
        setValue("dob['dobDay']", day);
        setValue("dob['dobMonth']", month);
        setValue("dob['dobYear']", year);
    };

    const [fileName, setFileName] = useState<string | null>(null);
    const getFileName = (name: string | null) => {
        if (name) {
            const currentImages = formValues.upload_media || [];
            const updatedImages = [...currentImages, name];
            setFileName(name);
            setValue('upload_media', updatedImages);
        }
    };

    const BtnSave = async () => {
        try {
            if (Object.keys(formValues).length != 0) {
                delete formValues.dob;
                const response = await saveJob(formValues);
                if ('data' in response) {
                    const jobId = response.data.data.JobId;
                    setValue('id', jobId);
                    if (userData != null) {
                        userData.IsEmployer = 'Y';
                        setUserData(userData);
                    }
                    if (isReview || id) {
                        setReview(1);
                    } else {
                        navigate('/cruz/viewcampaign/draftcampaign');
                    }

                } else {
                    console.error("Error saving job:", response.error);
                }
            } else {
                let firstQuestion = steps[stepIndex].questions[questionIndex];
                setValidationName(firstQuestion.validation);
                setDisError(1);
            }
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    };


    const handlePreview = async () => {
        try {
            if (Object.keys(formValues).length != 0) {
                setReview(2);
            }
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    };

    const handleFormSubmit = (data: FormValues) => {
        // Handle form submission logic here
    };

    const handleReviewGoBack = async (stepIndex: any, questionIndex: any) => {
        setValidationName('');
        setDisError(0);
        try {
            if (id && stepIndex === -1 && questionIndex === 0) {
                navigate(-1);
            }
            if (stepIndex === -1) {
                stepIndex = steps.length - 1;
            }
            setReview(0);
            setIsReview(true);
            setStepIndex(parseInt(stepIndex));
            setQuestionIndex(parseInt(questionIndex));
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    }
    const handlePreviewGoBack = async () => {
        try {
            setReview(1);
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        }
    }
    if (!isJobDetailsFetched) {
        return (
            <div className="page-loader">
                <div className="page-innerLoader">
                    <div className="spinner-border" role="status">
                        <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                    </div>
                </div>
            </div>
        );
    }

    if (review === 0) {
        return (
            <div className="row multiform-parent-section">


                <div className="multistepForm">


                    <Container className="text-center multistepForm-parent">
                        <Row>
                            <FormProvider {...form}>
                                <form
                                    className="MultiQuestionForm"
                                    onSubmit={handleSubmit(handleFormSubmit)}
                                    noValidate
                                >

                                    {data && steps && currentStep && (
                                        <Col className="col-lg-7 col-12 steps-option-section">
                                            <div className="step-count">
                                                <p>
                                                    <span className="Caption">{currentTitle}</span>
                                                </p>
                                            </div>
                                            <Progress value={((stepIndex + 1) / steps.length) * 100} />
                                            <div className='Stepper'>
                                                <Steps
                                                    title={steps[stepIndex].questions[questionIndex].title}
                                                    subtitle={steps[stepIndex].questions[questionIndex].sub_title}
                                                    placeholder={steps[stepIndex].questions[questionIndex].placeholder}
                                                    type={steps[stepIndex].questions[questionIndex].type}
                                                    name={steps[stepIndex].questions[questionIndex].name}
                                                    multiple={false}
                                                    Qoptions={steps[stepIndex].questions[questionIndex].options}
                                                    onOptionChange={handleOptionChange}
                                                    getFileName={getFileName}
                                                    sub_questions={steps[stepIndex].questions[questionIndex].sub_questions}
                                                    formValues={formValues}
                                                    setValue={setValue}
                                                    control={control}
                                                    startDate={startDate}
                                                    handleDateSelect={handleDateSelect}
                                                    exclude_jobrole={steps[stepIndex].questions[questionIndex].exclude_jobrole}
                                                    jobRole={jobRole}
                                                />
                                            </div>
                                        </Col>
                                    )}

                                    <Col className="action-groups col-lg-5 col-12">
                                        <div className={`action-steps ${disError === 1 ? 'error-active' : ''}`}>
                                            {disError === 1 && (
                                                <div className="error-alert">
                                                    <span>
                                                        <img src={require('../../assets/images/cruz/erroralert.png')} className='img-fluid' alt="" />
                                                        <span className="mx-2">{validationName}</span>
                                                    </span>
                                                </div>
                                            )}
                                            <div className="continue-action">
                                                <Button
                                                    text={'Continue'}
                                                    icon={true}
                                                    theme="light"
                                                    className="btn-continue"

                                                    onClick={handleContinue}
                                                />
                                            </div>
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
                                            {stepIndex === steps.length - 1 && questionIndex === steps[stepIndex].questions.length - 1 && (
                                                <Button className='d-none' onClick={handleReset}>Reset</Button>
                                            )}
                                        </div>
                                    </Col>
                                </form>
                            </FormProvider>
                        </Row>
                    </Container>

                </div>
            </div>
        );
    } else if (review === 1) {
        return <ReviewJobEmployerProfile formValues={formValues} steps={steps} handlePreview={handlePreview} handleGoBack={handleReviewGoBack} />
    } else {
        return <ReviewEmployerPost formValues={formValues} steps={steps} handleGoBack={handlePreviewGoBack} />
    }
};
